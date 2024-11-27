// import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const handleRegister = async () => {
    try {
      if (!username || !name || !email || !password || !confirmPassword) {
        setError("All fields are required");
      } else if (password !== confirmPassword) {
        setError("Passwords do not match");
      } else if (password.length < 6) {
        setError("Password must be at least 6 characters long");
      }
      const userData = {
        username,
        email,
        name,
        password,
        confirmPassword,
      };

      try {
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const data = await response.json();
          setIsRegistered(true);
          console.log(data.message);
          // console.log(data.user);
          console.log("response ok");
        } else {
          console.log("response not ok");
          const data = await response.json();
          setError(data.message || "Something went wrong data");
          console.log(data.user);
        }
      } catch {
        setError("Something went wrong cathc");
      }
    } catch (err: unknown) {
      if (err instanceof String) {
        setError("");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col p-6 border rounded shadow-lg">
        <h2 className="mb-4 text-2xl">Register</h2>
        {/* username */}
        <input
          type="text"
          placeholder="username"
          className="p-2 mb-2 border rounded-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {/* email pengguna */}
        <input
          type="email"
          placeholder="mail@gmail.com"
          className="p-2 mb-2 border rounded-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* nama pengguna */}
        <input
          type="text"
          placeholder="name"
          className="p-2 mb-2 border rounded-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {/* password */}
        <input
          type="password"
          placeholder="password"
          className="p-2 mb-2 border rounded-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* confirm password */}
        <input
          type="password"
          placeholder="confirm password"
          className="p-2 mb-2 border rounded-sm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button onClick={handleRegister}>Register</button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {isRegistered && <Navigate to="/login" />}
      </div>
    </div>
  );
};

export default RegisterPage;
