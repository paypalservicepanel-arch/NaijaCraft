import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/router";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../contexts/AppContext";

export function MessagingPage() {
  const { conversations, sendMessage } = useApp();
  const initialConvId = new URLSearchParams(
    window.location.hash.split("?")[1] || "",
  ).get("conv");
  const [activeConvId, setActiveConvId] = useState<string | null>(
    initialConvId,
  );
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const msgCount = activeConv?.messages.length ?? 0;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message count change only
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgCount]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeConvId) return;
    sendMessage(activeConvId, newMessage.trim());
    setNewMessage("");
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    const today = new Date();
    const diff = today.getTime() - d.getTime();
    if (diff < 86400000) return formatTime(ts);
    return d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-background flex">
      {/* Conversations list */}
      <div
        className={`w-full md:w-80 bg-white border-r border-border flex flex-col ${
          activeConvId ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-lg">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-48 text-muted-foreground"
              data-ocid="messages.empty_state"
            >
              <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv, i) => {
              const otherIdx =
                conv.participantIds[0] === "current-user" ? 1 : 0;
              const otherName = conv.participantNames[otherIdx];
              const otherAvatar = conv.participantAvatars[otherIdx];
              return (
                <button
                  type="button"
                  key={conv.id}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-secondary transition-colors border-b border-border/50 text-left ${
                    activeConvId === conv.id ? "bg-secondary" : ""
                  }`}
                  onClick={() => setActiveConvId(conv.id)}
                  data-ocid={`messages.conversation.item.${i + 1}`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-11 h-11">
                      <AvatarImage src={otherAvatar} />
                      <AvatarFallback>{otherName[0]}</AvatarFallback>
                    </Avatar>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs text-white flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold truncate">
                        {otherName}
                      </p>
                      <p className="text-xs text-muted-foreground shrink-0">
                        {formatDate(conv.lastMessageTime)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat window */}
      {activeConvId && activeConv ? (
        <div
          className={`flex-1 flex flex-col ${
            activeConvId ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Chat header */}
          <div className="bg-white border-b border-border px-4 py-3 flex items-center gap-3">
            <button
              type="button"
              className="md:hidden p-1 hover:bg-secondary rounded"
              onClick={() => setActiveConvId(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {(() => {
              const otherIdx =
                activeConv.participantIds[0] === "current-user" ? 1 : 0;
              return (
                <>
                  <Avatar className="w-9 h-9">
                    <AvatarImage
                      src={activeConv.participantAvatars[otherIdx]}
                    />
                    <AvatarFallback>
                      {activeConv.participantNames[otherIdx][0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">
                      {activeConv.participantNames[otherIdx]}
                    </p>
                    <p className="text-xs text-green-500">Online</p>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderId === "current-user";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white text-foreground shadow-card rounded-bl-md"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMe ? "text-white/60" : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-border p-3 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
              data-ocid="messages.chat.input"
            />
            <Button
              className="bg-primary text-primary-foreground"
              onClick={handleSend}
              disabled={!newMessage.trim()}
              data-ocid="messages.send.button"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center flex-col text-muted-foreground">
          <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
          <p className="font-medium">Select a conversation to start chatting</p>
          <p className="text-sm mt-1">
            Your messages with artisans appear here
          </p>
        </div>
      )}
    </div>
  );
}
