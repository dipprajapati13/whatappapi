import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// WhatsApp connection state
export const whatsappState = pgTable("whatsapp_state", {
  id: serial("id").primaryKey(),
  isReady: boolean("is_ready").notNull().default(false),
  qrCode: text("qr_code"),
  connectedAt: timestamp("connected_at"),
  deviceInfo: text("device_info"),
  sessionId: text("session_id").notNull().default("session"),
});

// Message history
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"), // pending, sent, failed
  createdAt: timestamp("created_at").defaultNow(),
  error: text("error"),
});

// Schema for sending a message
export const sendMessageSchema = z.object({
  phone: z.string().min(8).max(20),
  message: z.string().min(1).max(4096),
});

// Types
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export type WhatsAppState = typeof whatsappState.$inferSelect;
export type InsertWhatsAppState = typeof whatsappState.$inferInsert;

export type SendMessageRequest = z.infer<typeof sendMessageSchema>;
