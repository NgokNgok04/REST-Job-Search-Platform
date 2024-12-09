// import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import UsersList from "./Pages/UsersList";
import ConnectionRequests from "./components/ConnectionRequest";
import ConnectionsList from "./Pages/Connection";
import ProfilPage from "./Pages/Profile";
import WorkHistory from "./components/Profile/WorkHistory";
import Skills from "./components/Profile/Skills";
import FeedPage from "./Pages/Feeds";
import Chat from "./components/Chat";
import Broh from "./components/Broh";

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

        <Route
          path="/users"
          element={
            <Layout>
              <UsersList />
            </Layout>
          }
        />

        <Route
          path="/requests"
          element={
            <Layout>
              <ConnectionRequests />
            </Layout>
          }
        />
        <Route
          path="/connections/:userId"
          element={
            <Layout>
              <ConnectionsList />
            </Layout>
          }
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
        <Route
          path="/chat/:id"
          element={
            <Layout>
              <Chat />
            </Layout>
          }
        />
        <Route
          path="/test"
          element={
            <Layout>
              <Broh />
            </Layout>
          }
        />

        <Route
          path="/feeds"
          element={
            <Layout>
              <FeedPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
