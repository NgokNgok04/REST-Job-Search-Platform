import { useAuth } from "@/contexts/authContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleLogin = async () => {
    if (!email || !password) {
      setError("All fields are required");
    }
    try {
      const response = await login({
        email,
        password,
      });
      if (!response.status) {
        setError(response.message);
      } else {
        localStorage.setItem("token", response.body.token);
        navigate("/");
      }
    } catch (err) {
      if (err) {
        setError("Error");
      }
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-semibold text-[#0073b1] mb-6 text-center">
          Sign In
        </h2>
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
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <a
            href="/register"
            className="text-sm text-[#0073b1] hover:text-[#005c8c]"
          >
            Join now
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
