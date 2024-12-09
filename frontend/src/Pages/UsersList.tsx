import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { useToast } from "../components/hooks/use-toast";
import UserCard from "@/components/UserCard";

interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string | null;
  profile_photo_path?: string | null;
  isConnected?: boolean;
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
          {
            withCredentials: true,
          }
        );
        setIsLoggedIn(response.data.success);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const fetchUsers = async (query: string = "") => {
    if (isLoggedIn === null) return; 

    try {
      const api = isLoggedIn
        ? "http://localhost:3000/api/users-logged"
        : "http://localhost:3000/api/users";

      const response = await axios.get(api, {
        params: { search: query },
        withCredentials: true,
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

  useEffect(() => {
    if (isLoggedIn !== null) {
      fetchUsers();
    }
  }, [isLoggedIn]);

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

  const unconnectConnection = async (toId: string) => {
    try {
      await axios.delete("http://localhost:3000/api/connections/unconnect", {
        data: { to_id: toId },
        withCredentials: true,
      });
      toast.toast({
        title: "Disconnected",
        description: "You have successfully unconnected.",
      });
      fetchUsers();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to disconnect.";
      toast.toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    }
  };

  const handleAction = (userId: string, isConnected: boolean) => {
    if (isConnected) {
      unconnectConnection(userId);
    } else {
      sendConnectionRequest(userId);
    }
  };

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
          <UserCard
            key={user.id}
            user={user}
            isLoggedIn={!!isLoggedIn}
            onAction={handleAction}
          />
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
