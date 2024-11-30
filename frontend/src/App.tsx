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
import WorkHistory from "./components/Profile/WorkHistory";
import Skills from "./components/Profile/Skills";

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
            <Layout cn="">
              <ProfilPage />
            </Layout>
          }
        />
        <Route
          path="/profil/work-history/:id"
          element={
            <Layout>
              <WorkHistory />
            </Layout>
          }
        />
        <Route
          path="/profil/skills/:id"
          element={
            <Layout>
              <Skills />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
