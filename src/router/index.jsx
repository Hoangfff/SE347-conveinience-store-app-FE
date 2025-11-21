import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/DashBoard";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Employee from "../pages/Employees";
import Shops from "../pages/Shops";
import Orders from "../pages/Orders"
import TestCard from "../pages/Test";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />, // Layout có Sidebar/Header
    children: [
      { path:"/test-card", element: <TestCard />},
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/products", element: <Products /> },
      { path: "/employees", element: <Employee />},
      { path: "/shops", element: <Shops />},
      { path: "/orders", element: <Orders />},
      // Thêm các route con khác (Stores, Employees...)
    ],
  },
  {
    path: "/login",
    element: <Login />, // Trang Login thường không có Sidebar
  },
]);

export default router;