import { createBrowserRouter, RouteObject } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
