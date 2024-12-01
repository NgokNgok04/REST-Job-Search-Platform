import React, { useState, useEffect } from "react";
import axios from "axios";

interface ConnectionRequest {
  from_id: string;
  to_id: string;
  full_name: string;
  email: string;
  created_at: string;
}

const ConnectionRequests: React.FC = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<ConnectionRequest[]>(
        `http://localhost:3000/api/connections/requests`,
        { withCredentials: true }
      );
      setRequests(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const { success, message } = err.response.data;

        if (!success) {
          setError(message || "An error occurred.");
        }
      } else {
        setError("Failed to fetch requests. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (toId: string, action: "accept" | "reject") => {
    setActionLoading(toId);
    setError("");

    try {
      await axios.post(
        "http://localhost:3000/api/connections/respond",
        { to_id: toId, action },
        { withCredentials: true }
      );

      setRequests((prev) => prev.filter((request) => request.to_id !== toId));
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const { success, message } = err.response.data;

        if (!success) {
          setError(message || "An error occurred.");
        }
      } else {
        setError("Failed to fetch respond connection. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Connection Requests</h1>
      {loading && <p>Loading requests...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && requests.length === 0 && (
        <p>No connection requests found.</p>
      )}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {requests.map((request) => (
          <li
            key={request.from_id}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>Name:</strong> {request.full_name || "Unknown"}
            </p>
            <p>
              <strong>Email:</strong> {request.email || "Unknown"}
            </p>
            <p>
              <strong>Requested At:</strong>{" "}
              {new Date(request.created_at).toLocaleString()}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleAction(request.from_id, "accept")}
                disabled={actionLoading === request.from_id}
                style={{
                  padding: "10px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    actionLoading === request.from_id
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {actionLoading === request.from_id && "Processing..."}
                {actionLoading !== request.from_id && "Accept"}
              </button>
              <button
                onClick={() => handleAction(request.from_id, "reject")}
                disabled={actionLoading === request.from_id}
                style={{
                  padding: "10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    actionLoading === request.from_id
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {actionLoading === request.from_id && "Processing..."}
                {actionLoading !== request.from_id && "Reject"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionRequests;
