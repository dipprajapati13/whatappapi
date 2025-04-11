import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiDocs() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">API Documentation</CardTitle>
        <p className="text-gray-600">Use these endpoints to integrate with the WhatsApp API</p>
      </CardHeader>
      
      <CardContent>
        <div className="border-t border-gray-200 pt-4 space-y-6">
          {/* Status Endpoint */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Check WhatsApp Status</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded mr-2 text-xs">GET</span>
                <code className="font-mono">/api/status</code>
              </div>
              <p className="text-sm text-gray-600 mb-2">Returns the current connection status of the WhatsApp client</p>
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-500 mb-1">Response:</div>
                <pre className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto text-gray-700">{`{
  "isReady": true|false,
  "connectedAt": "2023-07-15T12:34:56.789Z",
  "deviceInfo": "Connected device",
  "sessionId": "session"
}`}</pre>
              </div>
            </div>
          </div>
          
          {/* QR Code Endpoint */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Get QR Code</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded mr-2 text-xs">GET</span>
                <code className="font-mono">/api/qr</code>
              </div>
              <p className="text-sm text-gray-600 mb-2">Returns the current QR code for WhatsApp Web authentication</p>
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-500 mb-1">Response:</div>
                <pre className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto text-gray-700">{`{
  "qrCode": "base64_encoded_image",
  "isReady": false
}`}</pre>
              </div>
            </div>
          </div>
          
          {/* Refresh QR Endpoint */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Refresh QR Code</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded mr-2 text-xs">POST</span>
                <code className="font-mono">/api/refresh-qr</code>
              </div>
              <p className="text-sm text-gray-600 mb-2">Requests a new QR code for WhatsApp authentication</p>
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-500 mb-1">Response:</div>
                <pre className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto text-gray-700">{`{
  "success": true,
  "message": "QR refresh initiated"
}`}</pre>
              </div>
            </div>
          </div>
          
          {/* Send Message Endpoint */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Send WhatsApp Message</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded mr-2 text-xs">POST</span>
                <code className="font-mono">/api/send</code>
              </div>
              <p className="text-sm text-gray-600 mb-2">Sends a message to a WhatsApp number</p>
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-500 mb-1">Request Body:</div>
                <pre className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto text-gray-700">{`{
  "phone": "1234567890",  // Phone number with country code
  "message": "Hello from WhatsApp API"
}`}</pre>
              </div>
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-500 mb-1">Success Response:</div>
                <pre className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto text-gray-700">{`{
  "success": true,
  "message": "Message sent successfully",
  "id": 123
}`}</pre>
              </div>
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-500 mb-1">Error Response:</div>
                <pre className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto text-gray-700">{`{
  "error": "WhatsApp client not ready",
  "success": false
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
