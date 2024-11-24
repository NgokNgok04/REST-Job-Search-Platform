// import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleLogin = async () => {
        if (!email || !password){
            setError("All fields are required");
        }
        try{
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok){
                setError(data.message);
            } else {
                setSuccess(true);
                console.log(success);
                localStorage.setItem("token", data.token);
                console.log("token: ", data.token);
            }
        } catch (err: any){
            setError(err);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col p-6 border rounded shadow-lg">
                <h2 className="text-2xl mb-4">Login</h2>
                <input 
                    type="email" 
                    placeholder="mail@gmail.com" 
                    className="mb-2 p-2 border rounded-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password" 
                    placeholder="password"
                    className="mb-2 p-2 border rounded-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;