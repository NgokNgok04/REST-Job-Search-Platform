import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserCard from "@/components/UserCard";

interface User {
  id: string;
  username: string;
  full_name?: string;
  profile_photo_path?: string;
  isConnected?: boolean;
}

const ConnectionsList: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [connections, setConnections] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Cek apakah pengguna login atau tidak
  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/protected", {
        withCredentials: true,
      });
      setIsLoggedIn(response.data.success);
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);


  const fetchConnections = async () => {
    if (!userId) {
      setError("User ID is required.");
      return;
    }

    if (isLoggedIn === null) return; 

    setLoading(true);
    setError("");

    try {
      const api = isLoggedIn
        ? `http://localhost:3000/api/connections-logged/${userId}`
        : `http://localhost:3000/api/connections/${userId}`;
      const response = await axios.get<{
        success: boolean;
        body: User[];
      }>(api, {
        withCredentials: true,
      });

      const { success, body } = response.data;

      if (success) {
        setConnections(body);
      } else {
        setError("Failed to fetch connections.");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const { success, message } = err.response.data;
        if (!success) {
          setError(message || "An error occurred.");
        }
      } else {
        setError("Failed to fetch connections. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnection = async (toId: string, isConnected: boolean) => {
    setLoading(true);
    setError("");

    try {
      if (isConnected) {
        await axios.delete("http://localhost:3000/api/connections/unconnect", {
          data: { to_id: toId },
          withCredentials: true,
        });
        alert("Connection successfully unconnected.");
      } else {
        await axios.post(
          "http://localhost:3000/api/connections/request",
          {
            to_id: toId,
          },
          {
            withCredentials: true,
          }
        );
        alert("Connection request sent.");
      }

      fetchConnections(); 
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const { success, message } = err.response.data;
        if (!success) {
          setError(message || "An error occurred.");
        }
      } else {
        setError(
          "Failed to process connection request. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn !== null) {
      fetchConnections(); 
    }
  }, [userId, isLoggedIn]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Connections</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && connections.length === 0 && (
        <p>No connections found for this user.</p>
      )}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {connections.map((connection) => (
          <UserCard
            key={connection.id}
            user={connection}
            isLoggedIn={!!isLoggedIn}
            onAction={() =>
              handleConnection(connection.id, connection.isConnected || false)
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default ConnectionsList;
