import { useState, useEffect, useRef } from "react";

// Define a type for messages
interface Message {
  message: string;
  username: string;
}

const Chat = () => {
    const [myMessage, setMyMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState<string>(""); 
    const socketRef = useRef<WebSocket | null>(null); 

    useEffect(() => {
        const newSocket = new WebSocket("ws://127.0.0.1:8000");
        socketRef.current = newSocket;
    
        newSocket.onopen = () => {
            console.log("WebSocket Client Connected");
        };
    
        newSocket.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                console.log(data.type);
                switch (data.type) {
                    case "message":
                        if (data.message && data.username) {
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                {
                                    message: data.message,
                                    username: data.username,
                                },
                            ]);
                        } else {
                            console.warn("Invalid 'message' format:", data);
                        }
                        break;
    
                    case "welcome":
                        console.log("Welcome message received:", data);
                        if (data.userId) {
                            setUsername(data.userId); 
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
    }, []); 
    

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
