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
        <Route path="/users" element={<UsersList loggedUser="1" />} />
        <Route
          path="/requests"
          element={<ConnectionRequests loggedUser="2" />}
        />
        <Route
          path="/connections"
          element={<ConnectionsList loggedUser="2" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
