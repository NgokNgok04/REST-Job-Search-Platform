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
import UsersList from "./Pages/UsersList";
import ConnectionRequests from "./Pages/ConnectionRequest";
import ConnectionsList from "./Pages/Connection";
import ProfilPage from "./Pages/Profile";
import WorkHistory from "./components/Profile/WorkHistory";
import Skills from "./components/Profile/Skills";
import Chat from "./components/Chat";
import { getCookie } from "./utils/cookieHandler";
import ChatRooms from "./components/ChatRooms";
import Feed from "./Pages/Feed";
import NotFound from "./components/NotFound";

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
          path="/chats"
          element={
            <Layout>
              <ChatRooms />
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

        {auth && (
          <Route
            path="/feeds"
            element={
              <Layout>
                <Feed />
              </Layout>
            }
          />
        )}
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
