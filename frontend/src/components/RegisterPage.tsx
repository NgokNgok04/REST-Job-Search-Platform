// import React from "react";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";


const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleRegister = async () => {
        try{
            // TODO : call API
        } catch (err: any){
            setError(err);
        }
    }
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col p-6 border rounded shadow-lg">
                <h2 className="text-2xl mb-4">Register</h2>
                {/* username */}
                <input 
                    type="text" 
                    placeholder="username" 
                    className="mb-2 p-2 border rounded-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {/* email pengguna */}
                <input 
                    type="email" 
                    placeholder="mail@gmail.com" 
                    className="mb-2 p-2 border rounded-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {/* nama pengguna */}
                <input 
                    type="text" 
                    placeholder="name" 
                    className="mb-2 p-2 border rounded-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {/* password */}
                <input
                    type="password" 
                    placeholder="password"
                    className="mb-2 p-2 border rounded-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* confirm password */}
                <input
                    type="password" 
                    placeholder="confirm password"
                    className="mb-2 p-2 border rounded-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleRegister}>Register</button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default RegisterPage;