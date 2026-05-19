import { useEffect, useState, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "@/context/AuthContext";

export const useChatWebSocket = (roomId) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const clientRef = useRef(null);

  const onMessageReceived = useCallback(
    (payload) => {
      try {
        const message = JSON.parse(payload.body);
        // Only add to current chat if it matches the active roomId
        if (message.chatRoomId === roomId) {
          setMessages((prev) => {
            // Prevent duplicate messages by ID
            if (prev.some((m) => m.id === message.id)) return prev;
            
            // Filter out optimistic messages that match the incoming real message
            // Temporary IDs are Date.now() which are huge numbers
            const filtered = prev.filter(m => {
              const isOptimisticMatch = m.id > 1000000000000 && 
                                        m.content === message.content && 
                                        m.senderId === message.senderId;
              return !isOptimisticMatch;
            });
            
            return [...filtered, message];
          });
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    },
    [roomId],
  );

  useEffect(() => {
    if (!user || !roomId) {
      console.log(
        "WebSocket: Waiting for user or roomId. User:",
        !!user,
        "RoomId:",
        !!roomId,
      );
      return;
    }

    // Token is now handled via HttpOnly cookies automatically
    // We check if user is available from context
    if (!user) {
      console.error("WebSocket: User not found in context");
      setError("User session not found");
      return;
    }

    console.log(
      "WebSocket: Initializing connection for roomId:",
      roomId,
      "userId:",
      user.userId,
    );

    const socket = new SockJS("http://localhost:8080/ws", null, {
      transports: ["websocket", "xhr-streaming", "xhr-polling"],
      withCredentials: true,
    });

    const stompClient = new Client({
      webSocketFactory: () => socket,
      // Authorization is handled via HttpOnly cookies
      connectHeaders: {},
      debug: (msg) => {
        console.log("STOMP Debug:", msg);
      },
      onConnect: (frame) => {
        console.log("WebSocket Connected:", frame);
        setIsConnected(true);
        setError(null);
        // Subscribe to user-specific queue
        stompClient.subscribe(
          `/user/${user.userId}/queue/messages`,
          onMessageReceived,
          {
            ack: "auto",
          },
        );
        console.log("Subscribed to /user/" + user.userId + "/queue/messages");
      },
      onStompError: (frame) => {
        console.error("Broker reported error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
        setError(frame.headers["message"] || "WebSocket connection error");
        setIsConnected(false);
      },
      onWebSocketClose: () => {
        console.log("WebSocket closed");
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection error: " + error.message);
        setIsConnected(false);
      },
      onDisconnect: (frame) => {
        console.log("STOMP disconnected:", frame);
        setIsConnected(false);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      console.log("Cleaning up WebSocket connection");
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [user, roomId, onMessageReceived]);

  const sendMessage = useCallback(
    (content, recipientId) => {
      if (clientRef.current && isConnected) {
        const chatMessageRequest = {
          chatRoomId: roomId,
          content: content,
          recipientId: recipientId,
        };

        // Optimistically update the UI
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(), // Temporary optimistic ID
            chatRoomId: roomId,
            senderId: user?.userId,
            recipientId: recipientId,
            content: content,
            timestamp: new Date().toISOString(),
            isRead: false
          }
        ]);

        clientRef.current.publish({
          destination: "/app/chat.send",
          body: JSON.stringify(chatMessageRequest),
        });
        console.log("Message sent to /app/chat.send");
      } else {
        const errorMsg =
          "STOMP client is not connected. Connected: " + isConnected;
        console.error(errorMsg);
        setError(errorMsg);
      }
    },
    [isConnected, roomId, user],
  );

  // Used to initialize messages from REST API
  const setInitialMessages = useCallback((initialMessages) => {
    setMessages(initialMessages);
  }, []);

  return {
    messages,
    isConnected,
    error,
    sendMessage,
    setInitialMessages,
  };
};
