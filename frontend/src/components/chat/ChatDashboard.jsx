"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserChatRooms, getChatMessages } from "@/api/chat.api";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Send, MessageSquare, Building2, User } from "lucide-react";

export default function ChatDashboard({ role }) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const urlRoomId = searchParams?.get("roomId");
  const [activeRoom, setActiveRoom] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  // 1. Fetch Chat Rooms
  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["chat-rooms"],
    queryFn: getUserChatRooms,
    enabled: !!user,
  });

  // Auto-select room from URL
  useEffect(() => {
    if (rooms && rooms.length > 0 && urlRoomId) {
      const targetRoom = rooms.find((r) => r.id === parseInt(urlRoomId));
      if (targetRoom) {
        setActiveRoom(targetRoom);
      }
    }
  }, [rooms, urlRoomId]);

  // 2. Fetch Messages for Active Room
  const { data: initialMessages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["chat-messages", activeRoom?.id],
    queryFn: () => getChatMessages(activeRoom.id, 0, 50),
    enabled: !!activeRoom?.id,
  });

  // 3. WebSocket Hook
  const { messages, isConnected, sendMessage, setInitialMessages } = useChatWebSocket(activeRoom?.id);

  // When initial messages load, set them in the hook (reverse them because they arrive newest first due to desc order)
  useEffect(() => {
    if (initialMessages && initialMessages.content) {
      setInitialMessages([...initialMessages.content].reverse());
    }
  }, [initialMessages, setInitialMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeRoom) return;

    sendMessage(messageInput.trim(), activeRoom.otherPartyUserId);
    setMessageInput("");
  };

  const isSeeker = role === "seeker";

  return (
    <div className="flex h-[calc(100vh-10rem)] rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Sidebar - Chat Rooms List */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoadingRooms ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
            </div>
          ) : rooms?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p>No active conversations</p>
            </div>
          ) : (
            rooms?.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room)}
                className={`w-full text-left p-4 border-b border-gray-100 transition-colors hover:bg-gray-100 ${
                  activeRoom?.id === room.id ? "bg-brand-light/30 border-l-4 border-l-brand-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                    {room.otherPartyAvatar ? (
                      <img src={room.otherPartyAvatar} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      isSeeker ? <Building2 size={20} /> : <User size={20} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">{room.otherPartyName}</p>
                    <p className="text-xs text-gray-500 truncate">{room.jobTitle}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col bg-white">
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                  {activeRoom.otherPartyAvatar ? (
                    <img src={activeRoom.otherPartyAvatar} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    isSeeker ? <Building2 size={20} /> : <User size={20} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activeRoom.otherPartyName}</h3>
                  <p className="text-xs text-brand-primary">{activeRoom.jobTitle}</p>
                </div>
              </div>
              {!isConnected && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Disconnected
                </span>
              )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {isLoadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMine = msg.senderId === user?.userId;
                  return (
                    <div key={msg.id || index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isMine
                            ? "bg-brand-primary text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span className={`text-[10px] mt-1 block ${isMine ? "text-blue-100" : "text-gray-500"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || !isConnected}
                  className="bg-brand-primary text-white h-10 w-10 rounded-full flex items-center justify-center hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
