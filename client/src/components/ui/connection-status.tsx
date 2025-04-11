import React from "react";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  const statusColor = isConnected 
    ? "bg-green-500" 
    : "bg-amber-500";
  
  const statusText = isConnected 
    ? "Connected" 
    : "Waiting for connection...";
  
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-3 w-3 rounded-full ${statusColor}`} />
      <span className="text-sm font-medium">{statusText}</span>
    </div>
  );
}
