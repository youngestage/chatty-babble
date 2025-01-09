import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // TODO: Implement real auth

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AuthForm mode="login" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
};

export default Index;