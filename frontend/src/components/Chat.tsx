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

    return (
        <>
        <div className="title">Socket Chat: {username || "Guest"}</div>
        <div className="messages">
            {messages.map((message, key) => (
            <div
                key={key}
                className={`message ${username === message.username ? "flex-end" : "flex-start"}`}
            >
                <section>{message.username[0].toUpperCase()}</section>
                <h4>{message.username + ":"}</h4>
                <p>{message.message}</p>
                <p>{message.timestamp}</p>
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
