import { useState } from "react";
import { User, Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: [
      { id: "2", name: "Alice Smith", email: "alice@example.com" },
    ],
    unreadCount: 2,
    lastMessage: {
      id: "msg1",
      content: "Hey, how are you?",
      senderId: "2",
      receiverId: "1",
      timestamp: new Date(),
    },
  },
  {
    id: "2",
    participants: [
      { id: "3", name: "Bob Johnson", email: "bob@example.com" },
    ],
    unreadCount: 0,
    lastMessage: {
      id: "msg2",
      content: "See you tomorrow!",
      senderId: "1",
      receiverId: "3",
      timestamp: new Date(),
    },
  },
];

export const ChatSidebar = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  return (
    <div className="w-80 border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {mockConversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant="ghost"
              className={`w-full justify-start p-3 mb-1 ${
                selectedConversation === conversation.id ? "bg-muted" : ""
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={conversation.participants[0].avatar} />
                  <AvatarFallback>
                    {conversation.participants[0].name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {conversation.participants[0].name}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-white text-xs px-2 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage?.content}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};