import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { whatsappApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function QrSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [connectionTime, setConnectionTime] = useState<string>("--:--");
  
  // Query to fetch connection status first
  const { data: statusData } = useQuery({
    queryKey: ['/api/status'],
    refetchInterval: 5000,
  });

  // Calculate if connection is ready
  const isConnected = statusData?.isReady || false;
  const deviceInfo = statusData?.deviceInfo || "Pending";
  const sessionId = statusData?.sessionId || "session";
  
  // Query to fetch QR code and status
  const { data: qrData, isLoading: qrLoading } = useQuery({
    queryKey: ['/api/qr'],
    refetchInterval: isConnected ? false : 5000, // Only refetch when not connected
  });
  
  // Mutation to refresh QR code
  const refreshQrMutation = useMutation({
    mutationFn: whatsappApi.refreshQrCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/qr'] });
      queryClient.invalidateQueries({ queryKey: ['/api/status'] });
      toast({
        title: "QR Code Refreshed",
        description: "Please scan the new QR code with your phone",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to refresh QR",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  });

  // Handle refresh QR button click
  const handleRefreshQR = () => {
    refreshQrMutation.mutate();
  };

  // Update connection time if connected
  useEffect(() => {
    if (!isConnected || !statusData?.connectedAt) {
      setConnectionTime("--:--");
      return;
    }

    const connectedAt = new Date(statusData.connectedAt);
    
    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - connectedAt.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setConnectionTime(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [isConnected, statusData?.connectedAt]);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">WhatsApp Connection</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-whatsapp-green hover:text-whatsapp-light flex items-center gap-1"
          onClick={handleRefreshQR}
          disabled={refreshQrMutation.isPending}
        >
          {refreshQrMutation.isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="border-t border-gray-200 pt-4">
          {/* Loading state */}
          {(qrLoading || refreshQrMutation.isPending) && (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Generating WhatsApp QR code...</p>
            </div>
          )}
          
          {/* QR Code display */}
          {!qrLoading && !refreshQrMutation.isPending && !isConnected && qrData?.qrCode && (
            <div className="py-8 flex flex-col items-center">
              <div className="mb-4 p-4 bg-white border-4 border-green-600 rounded-lg">
                <img 
                  src={qrData.qrCode} 
                  alt="WhatsApp QR Code" 
                  className="w-64 h-64"
                />
              </div>
              <p className="text-gray-700 mb-2 text-center">Scan this QR code with WhatsApp on your phone</p>
              <p className="text-sm text-gray-500 text-center">Open WhatsApp &gt; Menu &gt; WhatsApp Web &gt; Scan QR Code</p>
            </div>
          )}
          
          {/* Connected state */}
          {isConnected && (
            <div className="py-8 flex flex-col items-center">
              <div className="mb-4 p-4 bg-green-50 border-2 border-green-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium text-green-700 mb-2">WhatsApp Connected Successfully</p>
              <p className="text-sm text-gray-600 text-center">You can now send messages using the API</p>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Connection Status:</div>
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
              Active for: {connectionTime}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isConnected ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
            }`}>
              Device: {deviceInfo}
            </div>
          </div>
          <div className="text-xs text-gray-500">Session ID: <span className="font-mono">{sessionId}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
