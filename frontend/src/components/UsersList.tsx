import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";

interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string | null;
  profile_photo_path?: string | null;
}

const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const UsersList: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/status",
          {
            withCredentials: true,
          }
        );
        setIsLoggedIn(response.data.success);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const fetchUsers = async (query: string = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        params: { search: query },
      });
      setUsers(response.data.body || []);
    } catch (err: any) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedFetchUsers(e.target.value);
  };

  const sendConnectionRequest = async (toId: string) => {
    setSendingRequest(toId);
    setError("");

    try {
      await axios.post(
        "http://localhost:3000/api/connections/request",
        { to_id: toId },
        { withCredentials: true }
      );
      alert("Connection request sent successfully!");
    } catch {
      setError("Failed to send request. Please try again later.");
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
      <Input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearchChange}
        className="w-full px-4 py-2 mb-4 text-base"
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => sendConnectionRequest(user.id)}
                  disabled={!isLoggedIn || sendingRequest === user.id}
                  variant={isLoggedIn ? "default" : "outline"}
                  className={isLoggedIn ? "" : "opacity-50 cursor-not-allowed"}
                >
                  {sendingRequest === user.id
                    ? "Sending..."
                    : isLoggedIn
                    ? "Send Request"
                    : "Login to Send Request"}
                </Button>
              </TooltipTrigger>
              {!isLoggedIn && (
                <TooltipContent>
                  <p>You need to log in to send connection requests.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
