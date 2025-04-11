import React from "react";
import Header from "@/components/ui/header";
import QrSection from "@/components/ui/qr-section";
import MessageSender from "@/components/ui/message-sender";
import ApiDocs from "@/components/ui/api-docs";
import Footer from "@/components/ui/footer";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  // Query to fetch the status periodically
  const { data: statusData } = useQuery({
    queryKey: ['/api/status'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isConnected={statusData?.isReady || false} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QrSection />
          <MessageSender />
        </div>
        
        <ApiDocs />
      </main>
      
      <Footer />
    </div>
  );
}
