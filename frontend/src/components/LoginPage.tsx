// import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("All fields are required");
    }
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        if (data.body.status === false) {
          setError(data.body.message);
        } else {
          setSuccess(true);
          localStorage.setItem("token", data.body.token);
        }
      }
    } catch (err) {
      if (err) {
        setError("Error");
      }
    }
  };
  // if (success) {
  //   console.log("MASUKKK PAK EKOO");
  // } else {
  //   console.log("BELUM MASUK");
  // }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-semibold text-[#0073b1] mb-6 text-center">Sign In</h2>
        <input
          type="email"
          placeholder="mail@gmail.com"
          className="p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full p-3 bg-[#0073b1] text-white font-semibold rounded-md shadow-md hover:bg-[#005c8c] transition duration-200"
        >
          Login
        </button>
        {error && (<p className="mt-4 text-red-500 text-center">{error}</p>)}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <a href="/register" className="text-sm text-[#0073b1] hover:text-[#005c8c]">Join now</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
