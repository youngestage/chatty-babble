import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

interface ConversationUser {
  id: string;
  name: string;
  avatar?: string | null;
}

interface Conversation {
  id: string;
  user: ConversationUser;
  lastMessage: string | null;
  timestamp: string | null;
}

export const ChatSidebar = ({ onSelectConversation }: { onSelectConversation: (userId: string) => void }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
    subscribeToConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First fetch conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError);
        toast({
          variant: "destructive",
          title: "Error fetching conversations",
          description: conversationsError.message
        });
        return;
      }

      // Then fetch profiles for each conversation
      const formattedConversations = await Promise.all(conversationsData.map(async (conv) => {
        const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', otherUserId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return {
            id: otherUserId,
            user: {
              id: otherUserId,
              name: 'Unknown User',
              avatar: null
            },
            lastMessage: conv.last_message,
            timestamp: conv.last_message_at
          };
        }

        return {
          id: otherUserId,
          user: {
            id: otherUserId,
            name: profileData.username || 'Unknown User',
            avatar: profileData.avatar_url
          },
          lastMessage: conv.last_message,
          timestamp: conv.last_message_at
        };
      }));

      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error in fetchConversations:', error);
    }
  };

  const subscribeToConversations = () => {
    const channel = supabase
      .channel('conversations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('New message received:', payload);
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId);
    onSelectConversation(userId);
  };

  return (
    <div className="w-80 border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant="ghost"
              className={`w-full justify-start p-3 mb-1 ${
                selectedUserId === conversation.id ? "bg-muted" : ""
              }`}
              onClick={() => handleSelectConversation(conversation.id)}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={conversation.user.avatar || undefined} />
                  <AvatarFallback>
                    {conversation.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {conversation.user.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
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