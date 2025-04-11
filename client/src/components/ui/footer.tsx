import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-semibold">WhatsApp API Dashboard</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Powered by Venom-Bot & Express.js</p>
          </div>
          <div className="text-sm text-gray-400">
            <p>Server running on <span className="font-mono text-green-400">http://localhost:5000</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
