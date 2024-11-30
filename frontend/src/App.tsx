// import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import UsersList from "./components/UsersList";
import ConnectionRequests from "./components/ConnectionRequest";
import ConnectionsList from "./components/Connection";
import ProfilPage from "./Pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <RegisterPage />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        {/* TODO: change loggedUser */}
        <Route path="/users" element={<UsersList/>} />
        <Route
          path="/requests"
          element={<ConnectionRequests/>}
        />
        <Route
          path="/connections"
          element={<ConnectionsList/>}
        />
        <Route
          path="/profil/:id"
          element={
            <Layout cn="bg-[#F4F2EE]">
              <ProfilPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
