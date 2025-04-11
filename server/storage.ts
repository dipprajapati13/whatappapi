import { messages, type Message, type InsertMessage, whatsappState, type WhatsAppState, type InsertWhatsAppState } from "@shared/schema";

export interface IStorage {
  // WhatsApp state methods
  getWhatsAppState(): Promise<WhatsAppState | undefined>;
  updateWhatsAppState(state: Partial<InsertWhatsAppState>): Promise<WhatsAppState>;
  
  // Message methods
  saveMessage(message: InsertMessage): Promise<Message>;
  getMessages(limit?: number): Promise<Message[]>;
  updateMessageStatus(id: number, status: string, error?: string): Promise<Message | undefined>;
}

export class MemStorage implements IStorage {
  private whatsappStateData: WhatsAppState | undefined;
  private messagesData: Map<number, Message>;
  private nextMessageId: number;

  constructor() {
    this.messagesData = new Map();
    this.nextMessageId = 1;
    
    // Initialize WhatsApp state
    this.whatsappStateData = {
      id: 1,
      isReady: false,
      qrCode: undefined,
      connectedAt: undefined,
      deviceInfo: undefined,
      sessionId: "session"
    };
  }

  async getWhatsAppState(): Promise<WhatsAppState | undefined> {
    return this.whatsappStateData;
  }

  async updateWhatsAppState(state: Partial<InsertWhatsAppState>): Promise<WhatsAppState> {
    if (!this.whatsappStateData) {
      this.whatsappStateData = {
        id: 1,
        isReady: state.isReady || false,
        qrCode: state.qrCode,
        connectedAt: state.connectedAt,
        deviceInfo: state.deviceInfo,
        sessionId: state.sessionId || "session"
      };
    } else {
      this.whatsappStateData = {
        ...this.whatsappStateData,
        ...state
      };
    }
    return this.whatsappStateData;
  }

  async saveMessage(message: InsertMessage): Promise<Message> {
    const id = this.nextMessageId++;
    const now = new Date();
    const newMessage: Message = {
      ...message,
      id,
      createdAt: now,
      status: message.status || "pending",
      error: message.error
    };
    this.messagesData.set(id, newMessage);
    return newMessage;
  }

  async getMessages(limit: number = 100): Promise<Message[]> {
    const messages = Array.from(this.messagesData.values());
    return messages.sort((a, b) => {
      return b.createdAt && a.createdAt 
        ? b.createdAt.getTime() - a.createdAt.getTime() 
        : 0;
    }).slice(0, limit);
  }

  async updateMessageStatus(id: number, status: string, error?: string): Promise<Message | undefined> {
    const message = this.messagesData.get(id);
    if (!message) return undefined;
    
    const updatedMessage: Message = {
      ...message,
      status,
      error
    };
    
    this.messagesData.set(id, updatedMessage);
    return updatedMessage;
  }
}

export const storage = new MemStorage();
