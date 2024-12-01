import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Connection {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

const ConnectionsList: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    if (!userId) {
      setError("User ID is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get<{ success: boolean; body: Connection[] }>(
        `http://localhost:3000/api/connections/${userId}`
      );

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

  const unconnectConnection = async (toId: string) => {
    setLoading(true);
    setError("");

    try {
      await axios.delete("http://localhost:3000/api/connections/unconnect", {
        data: { to_id: toId },
        withCredentials: true,
      });

      alert("Connection successfully unconnected.");
      fetchConnections();
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const { success, message } = err.response.data;

        if (!success) {
          setError(message || "An error occurred.");
        }
      } else {
        setError("Failed to unconnect. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

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
          <li
            key={connection.id}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>Name:</strong> {connection.full_name || "Unknown"}
            </p>
            <p>
              <strong>Email:</strong> {connection.email || "Unknown"}
            </p>
            <p>
              <strong>Connected Since:</strong>{" "}
              {new Date(connection.created_at).toLocaleString()}
            </p>
            <button
              onClick={() => unconnectConnection(connection.id)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                color: "white",
                backgroundColor: "red",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Unconnect
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionsList;
