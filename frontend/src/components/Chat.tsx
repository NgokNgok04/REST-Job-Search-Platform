import { useState, useEffect, useRef } from "react";
import { set } from "react-hook-form";

// Define a type for messages
interface Message {
  userId: string;
  userRecipiendId: string; 
  username: string;
  message: string;
}

const Chat = () => {
    const [myMessage, setMyMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState<string>(""); 
    const [userId, setUserId] = useState<string>("");
    const socketRef = useRef<WebSocket | null>(null); 

    const [recipientId, setRecipientId] = useState<string>("");

    //hardocoded dulu 
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
                        if(data.body.id === "1") setRecipientId("2");
                        else setRecipientId("1");
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
            const initialMessage = {
                type: "user_id", 
                userId: userId, 
            };
            newSocket.send(JSON.stringify(initialMessage));
        };
    
        newSocket.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                if(data.to == data.from){
                    console.log("Message sent to self");
                    return;
                }
                switch (data.type) {
                    case "message":
                        console.log(data.message);
                        if (data.message && data.username && data.from && data.to) {
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                {
                                    userId: data.id,
                                    username: data.username,
                                    message: data.message,
                                    userRecipiendId: data.to,
                                },
                            ]);
                        } else {
                            console.warn("Invalid 'message' format:", data);
                        }
                        break;
                        
                    //testing 
                    case "welcome":
                        console.log("Welcome message received:", data);
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
    }, [username, userId]); 
    

    const onSend = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && myMessage.trim()) {
            const payload = {
                type: "message", 
                message: myMessage.trim(),
                username: username || "Guest",
                recipientId: recipientId,
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
                        {/* <section>{message.username[0].toUpperCase()}</section> */}
                        <h4>{message.username + ":"}</h4>
                        <p>{message.message}</p>
                        <br></br>
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
