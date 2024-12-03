import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Use null as initial state
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/protected",
          { withCredentials: true }
        );
        setIsLoggedIn(response.data.success);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const fetchUsers = async (query: string = "") => {
    setError(""); // Clear any previous error
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        params: { search: query },
        withCredentials: true,
      });
      setUsers(response.data.body || []);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch users.";
      setError(errorMessage);
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
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send request.";
      setError(errorMessage);
    } finally {
      setSendingRequest(null);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    // While checking the login status, you can render a loading message or redirect
    return <p>Loading...</p>;
  }

  if (!isLoggedIn) {
    return <p>You need to log in to view the users list.</p>;
  }

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

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && users.length === 0 && <p>No users found.</p>}
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => sendConnectionRequest(user.id)}
                    variant="default"
                  >
                    Send Request
                  </Button>
                </TooltipTrigger>
                {!isLoggedIn && (
                  <TooltipContent>
                    <p>You need to log in to send connection requests.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
