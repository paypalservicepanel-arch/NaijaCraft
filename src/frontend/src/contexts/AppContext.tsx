import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SAMPLE_CONVERSATIONS, SAMPLE_JOB_REQUESTS } from "../data/sampleData";
import type {
  Conversation,
  JobRequest,
  Message,
  User,
  UserRole,
} from "../types";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  artisanId?: string;
}

interface AppContextType {
  currentUser: AppUser | null;
  setCurrentUser: (user: AppUser | null) => void;
  jobRequests: JobRequest[];
  setJobRequests: React.Dispatch<React.SetStateAction<JobRequest[]>>;
  conversations: Conversation[];
  sendMessage: (convId: string, content: string) => void;
  addConversation: (
    artisanId: string,
    artisanName: string,
    artisanAvatar: string,
  ) => string;
  commissionRate: number;
  setCommissionRate: (rate: number) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem("naijaCraftUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [jobRequests, setJobRequests] =
    useState<JobRequest[]>(SAMPLE_JOB_REQUESTS);
  const [conversations, setConversations] =
    useState<Conversation[]>(SAMPLE_CONVERSATIONS);
  const [commissionRate, setCommissionRateState] = useState(10);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const setCurrentUser = useCallback((user: AppUser | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem("naijaCraftUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("naijaCraftUser");
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const setCommissionRate = useCallback((rate: number) => {
    setCommissionRateState(rate);
  }, []);

  const sendMessage = useCallback((convId: string, content: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== convId) return conv;
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          senderId: "current-user",
          receiverId:
            conv.participantIds.find((id) => id !== "current-user") || "",
          content,
          timestamp: new Date().toISOString(),
          read: false,
        };
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: content,
          lastMessageTime: newMsg.timestamp,
        };
      }),
    );
  }, []);

  const addConversation = useCallback(
    (artisanId: string, artisanName: string, artisanAvatar: string): string => {
      const existing = conversations.find((c) =>
        c.participantIds.includes(artisanId),
      );
      if (existing) return existing.id;
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        participantIds: ["current-user", artisanId],
        participantNames: ["You", artisanName],
        participantAvatars: ["https://i.pravatar.cc/150?img=20", artisanAvatar],
        lastMessage: "",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        messages: [],
      };
      setConversations((prev) => [...prev, newConv]);
      return newConv.id;
    },
    [conversations],
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        jobRequests,
        setJobRequests,
        conversations,
        sendMessage,
        addConversation,
        commissionRate,
        setCommissionRate,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
