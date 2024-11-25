import { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  full_name?: string | null;
  work_history?: string | null;
  skills?: string | null;
  profile_photo_path?: string | null;
  created_at: string;
  updated_at: string;
}

const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

interface Props {
  loggedUser: string; 
}
const UsersList:  React.FC<Props> = ({ loggedUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sendingRequest, setSendingRequest] = useState<string | null>(null); 

  const fetchUsers = async (query: string = ""): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<User[]>(
        "http://localhost:3000/api/users",
        {
          params: { search: query },
        }
      );
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedFetchUsers(value);
  };

  const sendConnectionRequest = async (toId: string) => {
    setSendingRequest(toId);
    setError("");

    try {
      await axios.post("http://localhost:3000/api/connections/request", {
        from_id: loggedUser, 
        to_id: toId,
      });

      alert("Connection request sent successfully!");
    } catch (err: any) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to send connection request.");
      }
    } finally {
      setSendingRequest(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>User List</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearchChange}
        style={{
          marginBottom: "20px",
          padding: "10px",
          fontSize: "16px",
          width: "100%",
        }}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Photo:</strong> {user.profile_photo_path || "N/A"}
            </p>
            <p>
              <strong>Full Name:</strong> {user.full_name || "N/A"}
            </p>
            <button
              onClick={() => sendConnectionRequest(user.id)}
              disabled={sendingRequest === user.id}
              style={{
                padding: "10px",
                backgroundColor: sendingRequest === user.id ? "#ccc" : "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: sendingRequest === user.id ? "not-allowed" : "pointer",
              }}
            >
              {sendingRequest === user.id ? "Sending..." : "Send Request"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
