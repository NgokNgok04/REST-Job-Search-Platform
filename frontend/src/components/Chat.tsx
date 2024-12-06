import { useState, useEffect, useRef } from "react";
import { set } from "react-hook-form";
import { useParams } from "react-router-dom";

// Define a type for messages
interface Message {
  userId: string;
  userRecipiendId: string; 
  username: string;
  message: string;
  timestamp: string; 
}

const Chat = () => {
    const { id } = useParams();  
    const [myMessage, setMyMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState<string>(""); 
    const [recpUsername, setRecpUsername] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const socketRef = useRef<WebSocket | null>(null);

    const recipientId = id?.toString();  
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/user", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok && data.body) {
                if (data.body.username) {
                    setUsername(data.body.username);
                }
                if (data.body.id) {
                    setUserId(data.body.id);
                }
                } else {
                    console.warn("Invalid user data:", data);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        const fetchRecipientData = async () => {
            try {
                if(recipientId == userId){
                    console.warn("Cannot chat with yourself"); 
                    return
                }
                const response = await fetch(`http://localhost:3000/api/user/${recipientId}`, {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", 
                });

                const data = await response.json();
                if (response.ok && data.body) {
                    if (data.body.username) {
                        setRecpUsername(data.body.username);
                    }
                } else {
                    console.warn("Invalid user data:", data);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
        fetchRecipientData();
    }, [recipientId]);


    useEffect(() => {
        const fetchChat = async () => {
            if (!userId || !recpUsername || !recipientId) return;
            try {
                const response = await fetch(`http://localhost:3000/api/chat/${id}`, {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", 
                });

                const data = await response.json();
                if (response.ok) {
                    console.log(data.body);
                    const fetchedMessages: Message[] = data.body.map((msg: any) => ({
                        from_id: msg.from_id,
                        to_id: msg.to_id,
                        message: msg.message,
                        timestamp: msg.timestamp,
                        username: msg.from_id === userId ? username : recpUsername, 
                    }));
                    setMessages(fetchedMessages);
                } else {
                    console.error("Failed to fetch messages:", data);
                }
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        };

        if(userId && recipientId && recpUsername){
            fetchChat();
        }

    }, [userId, recipientId, id, recpUsername]);

    useEffect(() => {
        if (!username || !userId) return;

        const newSocket = new WebSocket("ws://127.0.0.1:8000");
        socketRef.current = newSocket;

        newSocket.onopen = () => {
        console.log("WebSocket Client Connected");
        const initialMessage = {
            type: "user_id", 
            userId: userId, 
        };
        newSocket.send(JSON.stringify(initialMessage));
        };

        newSocket.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);

                switch (data.type) {
                case "message":
                    if (data.message && data.username && data.from && data.to) {
                        if ((data.from === userId && data.to === recipientId) || 
                            (data.from === recipientId && data.to === userId)) {
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                {
                                    userId: data.from,
                                    username: data.username,
                                    message: data.message,
                                    userRecipiendId: data.to,
                                    timestamp: new Date().toISOString(),
                                },
                            ]);
                        }
                    } else {
                        console.warn("Invalid 'message' format:", data);
                    }
                    break;

                case "welcome":
                    // console.log("Welcome message received:", data);
                    if (data.username) {
                    setUsername(data.username); 
                    }
                    break;

                default:
                    console.warn("Unknown message type:", data);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        newSocket.onclose = () => {
            console.log("WebSocket Client Disconnected");
        };

        newSocket.onerror = (error) => {
            console.error("WebSocket encountered an error:", error);
        };

        return () => {
            console.log("Cleaning up WebSocket connection...");
            newSocket.close();
        };
    }, [username, userId, recipientId]);

    const onSend = async () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && myMessage.trim()) {
            const payload = {
                type: "message", 
                message: myMessage.trim(),
                username: username || "Guest",
                recipientId: recipientId,
            };

            socketRef.current.send(JSON.stringify(payload));
            setMyMessage(""); 
            const response =  await fetch(`http://localhost:3000/api/chat/store/`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: myMessage, 
                    from_id: userId, 
                    to_id: recipientId, 
                    timestamp: new Date(),
                }),
                credentials: "include",
            });

            if(response.ok){
                console.log("Message sent successfully");
            } else {
                console.error("Failed to send message:", response);
            }
        } else {
            console.warn("WebSocket is not open or message is empty. Message not sent.");
        }

    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {!recpUsername ? (
                <div className="flex items-center justify-center h-screen bg-gray-100">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-700">Cannot Start Chat</h3>
                        <p className="text-gray-500 mt-2">
                            Recipient username not found. Please select a valid user to chat with.
                        </p>
                    </div>
                </div>
            ) : recpUsername === username ? (
                <div className="flex items-center justify-center h-screen bg-gray-100">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-700">Cannot Start Chat</h3>
                        <p className="text-gray-500 mt-2">
                            You cannot chat with yourself. Please select another user to chat with.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-screen bg-gray-100">
                    <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white shadow">
                        <h2 className="text-lg font-semibold">Chat with {recpUsername}</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((message, key) => (
                            <div
                                key={key}
                                className={`flex ${
                                    username === message.username
                                        ? "justify-start"
                                        : "justify-end"
                                }`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                                        username === message.username
                                            ? "bg-white text-gray-800"
                                            : "bg-blue-500 text-white"
                                    }`}
                                >
                                    <p className="text-sm">{message.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex items-center px-6 py-4 bg-gray-200">
                        <input
                            type="text"
                            value={myMessage}
                            onChange={(e) => setMyMessage(e.target.value)}
                            onKeyUp={(e) => e.key === "Enter" && onSend()}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={onSend}
                            className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chat;
