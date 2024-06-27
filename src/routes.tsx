import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import HomeLayout from "./layouts/HomeLayout";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Lists from "./pages/Lists";
import Home from "./pages/Home";
import Charts from "./pages/Charts";
import EditCharts from "./pages/EditCharts";
import EditNews from "./pages/EditNews";
import CreateList from "./pages/CreateList";
import ListDetail from "./pages/ListDetail";
import Favorites from "./pages/Favorites";
import AnonymousLayout from "./layouts/AnonymousLayout";
import AdminLayout from "./layouts/AdminLayout";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <HomeLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "charts",
        element: <Charts />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "lists",
        element: <Lists />,
      },
      {
        path: "lists/create",
        element: <CreateList />,
      },
      {
        path: "lists/:id",
        element: <ListDetail />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/anonymous",
    element: <AnonymousLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "charts",
        element: <Charts />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "signin",
        element: <Signin />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "editCharts",
        element: <EditCharts />,
      },
      {
        path: "editNews",
        element: <EditNews />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={"/dashboard/home"} />,
  },
]);
