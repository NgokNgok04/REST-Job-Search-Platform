// import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./components/RegisterPage";
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
import ChatRooms from "./components/ChatRooms";
// import client from "./utils/axiosClient";

function App() {
  // const id = useParams();
  // console.log("PATHTHHH:", path);
  // console.log("IDDDD :", id);
  // if ("serviceWorker" in navigator) {
  //   const handleServiceWorker = async () => {
  //     console.log("hellooo masuk function");
  //     const register = await navigator.serviceWorker.register("/sw.js");

  //     const subscription = await register.pushManager.subscribe({
  //       userVisibleOnly: true,
  //       applicationServerKey:
  //         "BJTARPAsvRE9jC-qCLiwOIWQzx3KBaFrA7t2DUq3iYEiyBUv6wlnY2M9L5sbcrhGbl6MG6uX5wcpoN9XoH0WCEk",
  //     });

  //     const res = await client.post("/subscribe", {
  //       ...subscription.toJSON(),
  //       user_id: id.id,
  //       // JSON.stringify(subscription)
  //     });
  //     console.log(res.data.message);
  //   };
  //   handleServiceWorker();
  // }
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
          path="/listchat" 
          element={<ChatRooms />} 
        />

        <Route path="/users" element={<UsersList />} />
        <Route path="/requests" element={<ConnectionRequests />} />
        <Route path="/connections/:userId" element={<ConnectionsList />} />
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
