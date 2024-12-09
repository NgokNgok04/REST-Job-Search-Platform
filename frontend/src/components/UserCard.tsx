// components/UserCard.tsx
import React from "react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface UserCardProps {
  user: {
    id: string;
    username: string;
    full_name?: string | null;
    profile_photo_path?: string | null;
    isConnected?: boolean;
  };
  isLoggedIn: boolean;
  onAction: (userId: string, isConnected: boolean) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isLoggedIn, onAction }) => {
  return (
    <a
      href={`/profil/${user.id}`}
      style={{
        padding: "10px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar>
          <AvatarImage
            src={`${import.meta.env.VITE_API_URL}${user.profile_photo_path}`}
            alt={user.username}
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase() || "B"}
          </AvatarFallback>{" "}
        </Avatar>
        <p>
          <strong>{user.username}</strong>
        </p>
      </div>

      {isLoggedIn && (
        <Button
          onClick={() => onAction(user.id, user.isConnected || false)}
          variant={user.isConnected ? "destructive" : "default"}
        >
          {user.isConnected ? "Unconnect" : "Send Request"}
        </Button>
      )}
    </a>
  );
};

export default UserCard;
