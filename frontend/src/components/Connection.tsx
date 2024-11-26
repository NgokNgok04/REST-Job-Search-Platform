import React, { useState, useEffect } from "react";
import axios from "axios";

interface Connection {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface Props {
  loggedUser: string;
}

const ConnectionsList: React.FC<Props> = ({ loggedUser }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch connections from API
  const fetchConnections = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<Connection[]>(
        `http://localhost:3000/api/connections/${loggedUser}`
      );
      setConnections(response.data);
    } catch (err) {
      setError("Failed to fetch connections.");
    } finally {
      setLoading(false);
    }
  };

  const unconnectConnection = async (toId: string) => {
    setLoading(true);
    setError("");

    try {
      await axios.delete("http://localhost:3000/api/connections/unconnect", {
        data: { from_id: loggedUser, to_id: toId },
      });

      alert("Connection successfully unconnected.");
      fetchConnections();
    } catch (err: any) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to send connection request.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [loggedUser]);

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
