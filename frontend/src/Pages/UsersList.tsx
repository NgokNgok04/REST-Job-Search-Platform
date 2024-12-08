import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../components/hooks/use-toast";

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const toast = useToast();

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
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        params: { search: query },
      });
      setUsers(response.data.body || []);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch users.";
      toast.toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    }
  };

  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedFetchUsers(e.target.value);
  };

  const sendConnectionRequest = async (toId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/connections/request",
        { to_id: toId },
        { withCredentials: true }
      );
      toast.toast({
        title: "Request Success",
        description: response.data.message,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send request.";
      toast.toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearchChange}
        className="w-full px-4 py-2 mb-4 text-base"
      />

      {users.length === 0 && <p>No users found.</p>}
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
            <Button
              onClick={() => sendConnectionRequest(user.id)}
              variant="default"
            >
              Send Request
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
