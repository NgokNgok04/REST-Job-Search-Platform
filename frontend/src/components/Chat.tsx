import { useState, useEffect, useRef } from "react";

// Define a type for messages
interface Message {
  userId: string;
  username: string;
  message: string;
}

const Chat = () => {
    const [myMessage, setMyMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState<string>(""); 
    const [userId, setUserId] = useState<string>("");
    const socketRef = useRef<WebSocket | null>(null); 

    // Fetch user data inside useEffect
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

        fetchUserData(); 
    }, []); 

    useEffect(() => {
        if (!username || !userId) return; // Wait until user data is set

        const newSocket = new WebSocket("ws://127.0.0.1:8000");
        socketRef.current = newSocket;
    
        newSocket.onopen = () => {
            console.log("WebSocket Client Connected");
        };
    
        newSocket.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                switch (data.type) {
                    case "message":
                        if (data.message && data.username && data.id) {
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                {
                                    userId: data.id,
                                    username: data.username,
                                    message: data.message,
                                },
                            ]);
                        } else {
                            console.warn("Invalid 'message' format:", data);
                        }
                        break;
    
                    case "welcome":
                        console.log("Welcome message received:", data);
                        if (data.username) {
                            setUsername(data.username); // Correctly set username
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
    }, [username, userId]); // Depend on username and userId to wait for user data before opening socket
    

    const onSend = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && myMessage.trim()) {
            const payload = {
                type: "message", 
                message: myMessage.trim(),
                username: username || "Guest",
            };
    
            socketRef.current.send(JSON.stringify(payload));
            setMyMessage(""); 
        } else {
            console.warn("WebSocket is not open or message is empty. Message not sent.");
        }
    };
    

    return (
        <>
            <div className="title">Socket Chat: {username || "Guest"}</div>
            <div className="messages">
                {messages.map((message, key) => (
                    <div
                        key={key}
                        className={`message ${
                            username === message.username ? "flex-end" : "flex-start"
                        }`}
                    >
                        <section>{message.username[0].toUpperCase()}</section>
                        <h4>{message.username + ":"}</h4>
                        <p>{message.message}</p>
                    </div>
                ))}
            </div>

            <div className="bottom form">
                <input
                    type="text"
                    value={myMessage}
                    onChange={(e) => setMyMessage(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && onSend()}
                    placeholder="Type your message"
                />
                <button onClick={onSend}>Send</button>
            </div>
        </>
    );
};

export default Chat;
