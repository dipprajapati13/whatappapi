import { apiRequest } from "./queryClient";
import { SendMessageRequest } from "@shared/schema";

// WhatsApp API client
export const whatsappApi = {
  // Get the current status of WhatsApp connection
  getStatus: async () => {
    const res = await fetch('/api/status', {
      credentials: 'include'
    });
    return await res.json();
  },
  
  // Get the current QR code
  getQrCode: async () => {
    const res = await fetch('/api/qr', {
      credentials: 'include'
    });
    return await res.json();
  },
  
  // Request a new QR code
  refreshQrCode: async () => {
    return apiRequest('POST', '/api/refresh-qr', {});
  },
  
  // Send a WhatsApp message
  sendMessage: async (data: SendMessageRequest) => {
    const res = await apiRequest('POST', '/api/send', data);
    return await res.json();
  }
};
