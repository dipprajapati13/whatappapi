import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { whatsappApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { sendMessageSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function MessageSender() {
  const { toast } = useToast();
  const [response, setResponse] = useState<any>(null);
  const [showResponse, setShowResponse] = useState(false);

  // Form setup with zod validation
  const form = useForm({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      phone: "",
      message: ""
    }
  });

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: whatsappApi.sendMessage,
    onSuccess: (data) => {
      setResponse(data);
      setShowResponse(true);
      toast({
        title: "Message sent successfully",
        description: `Message delivered to +${form.getValues().phone}`,
      });
      form.reset({ phone: "", message: "" });
    },
    onError: (error) => {
      let errorMessage = "Failed to send message";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      setResponse({ error: errorMessage });
      setShowResponse(true);
      toast({
        title: "Failed to send message",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  // Form submission handler
  const onSubmit = (data: { phone: string; message: string }) => {
    sendMessageMutation.mutate(data);
  };

  // Handle copy response to clipboard
  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2))
        .then(() => {
          toast({
            title: "Copied to clipboard",
            duration: 2000,
          });
        })
        .catch((err) => {
          toast({
            title: "Failed to copy",
            description: err.message,
            variant: "destructive",
          });
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Send WhatsApp Message</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="border-t border-gray-200 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">+</span>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1234567890 (with country code)"
                          className="pl-7 bg-gray-50"
                        />
                      </FormControl>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Include country code without + or 00 (e.g., 14155552671 for US)</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Type your message here..."
                        className="bg-gray-50"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-whatsapp-green hover:bg-whatsapp-light text-white"
                  disabled={sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Response display */}
        <div className="border-t border-gray-200 mt-6 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">API Response</h3>
          
          {showResponse ? (
            <div id="response-container" className="mt-2">
              {response && response.success ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">Message sent successfully</p>
                      <p className="mt-1 text-xs text-green-700">Message delivered to +{form.getValues().phone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">Failed to send message</p>
                      <p className="mt-1 text-xs text-red-700">{response?.error || "Unknown error"}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-500">API Response:</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-whatsapp-green hover:text-whatsapp-light flex items-center gap-1 h-6 px-2"
                    onClick={copyResponse}
                  >
                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </Button>
                </div>
                <pre className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto max-h-40 text-gray-700">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-8 flex justify-center items-center">
              <p className="text-sm text-gray-500">No messages sent yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
