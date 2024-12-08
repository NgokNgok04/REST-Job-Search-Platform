import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ChatRoom {
  otherUserId: string;
  lastMessage: {
    message: string;
    from_id: string;
    to_id: string;
    timestamp: string;
  };
  username?: string; 
}

const ChatRooms: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true;
    const fetchChatRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/listchat", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json" 
          },
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP Error: ${response.status}`);
        }

        if (isMounted) {
          if (data.body.chatRooms) {
            const chatRoomsWithUsernames = await Promise.all(data.body.chatRooms.map(async (room: ChatRoom) => {
              const userResponse = await fetch(`http://localhost:3000/api/user/${room.otherUserId}`, 
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              );
              const userData = await userResponse.json();
              if (userData) {
                return { ...room, username: userData.body.username };
              } else {
                return room;
              }
            }));
            setChatRooms(chatRoomsWithUsernames);
          } else {
            setChatRooms([]);
            setError("Invalid data format received");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An unexpected error occurred");
          setChatRooms([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchChatRooms();

    return () => {
      isMounted = false;
    };
  }, []); 

  const handleChatClick = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (chatRooms.length === 0) {
    return <div className="text-center text-gray-500">No chat rooms found</div>;
  }

  return (
    <div className="chat-rooms max-w-4xl mx-auto p-4">
      <ul className="space-y-4">
        {chatRooms.map((room) => (
          <li key={room.otherUserId} className="chat-room-item">
            <div 
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer"
              onClick={() => handleChatClick(room.otherUserId)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-xl font-semibold text-gray-800">{room.username}</div>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Last Message:</strong> {room.lastMessage.message}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                <strong>Time:</strong> {new Date(room.lastMessage.timestamp).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRooms;
