'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import ChatPanel from '@/components/ChatPanel';

type ChatPanelContextType = {
  showChatPanel: boolean;
  setShowChatPanel: (show: boolean) => void;
  ChatPanelComponent: ReactNode;
};

const ChatPanelContext = createContext<ChatPanelContextType | undefined>(undefined);

export function ChatPanelProvider({ children }: { children: ReactNode }) {
  const [showChatPanel, setShowChatPanel] = useState(true);

  const ChatPanelComponent = showChatPanel ? <ChatPanel /> : null;

  return (
    <ChatPanelContext.Provider value={{ showChatPanel, setShowChatPanel, ChatPanelComponent }}>
      {children}
    </ChatPanelContext.Provider>
  );
}

export function useChatPanel() {
  const context = useContext(ChatPanelContext);
  if (context === undefined) {
    throw new Error('useChatPanel must be used within a ChatPanelProvider');
  }
  return context;
}
