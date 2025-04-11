// Vercel serverless function entry pointds
import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from '../server/routes.js';

// Create Express app
const app = express();
const server = createServer(app);

// Register API routes
await registerRoutes(app);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(`Error: ${err.stack}`);
  
  // Handle authentication errors
  if (err.message === "Authentication required") {
    return res.status(401).json({ 
      message: "Authentication required. Please scan the QR code to login."
    });
  }
  
  res.status(500).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Export for Vercel serverless
export default async (req, res) => {
  app(req, res);
};