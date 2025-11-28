import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, // Show login at root
  },
  {
    path: "/admin",
    element: <AdminLayout />, // Admin panel with state-based navigation
  },
]);

export default router;