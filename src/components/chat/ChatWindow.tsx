import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sent: boolean;
  timestamp: Date;
}

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey there!",
    sent: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    content: "Hi! How are you?",
    sent: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "3",
    content: "I'm doing great, thanks for asking! How about you?",
    sent: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
];

export const ChatWindow = () => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Chat with Alice</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sent
                    ? "bg-chat-sent text-gray-800"
                    : "bg-chat-received border border-gray-100"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};