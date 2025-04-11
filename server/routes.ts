import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { create, Whatsapp } from "venom-bot";
import path from "path";
import { sendMessageSchema } from "@shared/schema";
import fs from "fs";

let client: Whatsapp | null = null;
let qrCodeBase64 = '';
let isReady = false;

function initWhatsapp() {
  create('session', (base64Qr) => {
    qrCodeBase64 = base64Qr;
    isReady = false;
    
    // Update storage with new QR code
    storage.updateWhatsAppState({
      isReady: false,
      qrCode: base64Qr
    });
    
    console.log("🔄 New QR generated");
  }, (statusSession) => {
    console.log('Session status:', statusSession);
  }, {
    headless: 'new',
    useChrome: true,
    chromiumArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
    executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium-browser',
    logQR: false,
  })
    .then((cli) => {
      client = cli;
      isReady = true;
      
      // Update storage with connected status
      storage.updateWhatsAppState({
        isReady: true,
        connectedAt: new Date(),
        deviceInfo: "Connected device"
      });
      
      console.log("✅ WhatsApp is ready");
      
      // Listen for disconnect events
      cli.onStateChange((state) => {
        if (state === 'CONFLICT' || state === 'UNPAIRED' || state === 'UNLAUNCHED') {
          console.log('⚠️ WhatsApp disconnected');
          isReady = false;
          storage.updateWhatsAppState({
            isReady: false,
            connectedAt: undefined,
            deviceInfo: undefined
          });
        }
      });
    })
    .catch((error) => {
      console.error("❌ Failed to initialize WhatsApp", error);
    });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize WhatsApp on server start
  initWhatsapp();
  
  // Create HTTP server
  const httpServer = createServer(app);

  // API Routes
  app.get('/api/status', async (req: Request, res: Response) => {
    const state = await storage.getWhatsAppState();
    res.json({
      isReady: state?.isReady || isReady,
      connectedAt: state?.connectedAt,
      deviceInfo: state?.deviceInfo,
      sessionId: state?.sessionId || 'session'
    });
  });

  app.get('/api/qr', async (req: Request, res: Response) => {
    const state = await storage.getWhatsAppState();
    res.json({
      qrCode: state?.qrCode || qrCodeBase64,
      isReady: state?.isReady || isReady
    });
  });

  app.post('/api/refresh-qr', async (req: Request, res: Response) => {
    // Close existing session if it exists
    if (client) {
      try {
        await client.close();
      } catch (error) {
        console.error('Error closing client:', error);
      }
      client = null;
    }
    
    // Reinitialize WhatsApp
    initWhatsapp();
    
    res.json({ success: true, message: 'QR refresh initiated' });
  });

  app.post('/api/send', async (req: Request, res: Response) => {
    // Validate client is ready
    if (!client || !isReady) {
      return res.status(400).json({ 
        error: 'WhatsApp client not ready',
        success: false 
      });
    }

    try {
      // Validate request body
      const result = sendMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: 'Invalid request data', 
          details: result.error.format(),
          success: false
        });
      }

      const { phone, message } = result.data;
      
      // Save message to storage
      const savedMessage = await storage.saveMessage({
        phone,
        message,
        status: 'pending'
      });

      try {
        // Format phone for WhatsApp
        const formattedPhone = `${phone}@c.us`;
        
        // Send the message
        await client.sendText(formattedPhone, message);
        
        // Update message status
        await storage.updateMessageStatus(savedMessage.id, 'sent');
        
        res.json({ 
          success: true, 
          message: 'Message sent successfully',
          id: savedMessage.id
        });
      } catch (error) {
        // Handle sending error
        await storage.updateMessageStatus(
          savedMessage.id, 
          'failed', 
          error instanceof Error ? error.message : 'Unknown error'
        );
        
        console.error("Error sending message:", error);
        res.status(500).json({ 
          error: 'Message failed', 
          details: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    } catch (error) {
      console.error("Error in send endpoint:", error);
      res.status(500).json({ 
        error: 'Internal server error', 
        success: false 
      });
    }
  });

  return httpServer;
}
