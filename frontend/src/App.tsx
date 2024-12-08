// import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import UsersList from "./components/UsersList";
import ConnectionRequests from "./components/ConnectionRequest";
import ConnectionsList from "./components/Connection";
import ProfilPage from "./Pages/Profile";
import WorkHistory from "./components/Profile/WorkHistory";
import Skills from "./components/Profile/Skills";
import FeedPage from "./Pages/Feeds";
import Chat from "./components/Chat";
import Broh from "./components/Broh";
import { getCookie } from "./utils/cookieHandler";

function App() {
  const auth = getCookie("authToken");
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
        {auth ? (
          <Route path="/" element={<Navigate to="/feeds" replace />} />
        ) : (
          <Route
            path="/"
            element={
              <Layout cn="bg-white">
                <Dashboard />
              </Layout>
            }
          />
        )}

        <Route path="/users" element={<UsersList />} />
        <Route path="/requests" element={<ConnectionRequests />} />
        <Route path="/connections/:userId" element={<ConnectionsList />} />
        <Route
          path="/profil/:id"
          element={
            <Layout>
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
