import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { FaThLarge, FaStore, FaBox, FaUserTie, FaShoppingCart } from 'react-icons/fa';
import { cn } from '../lib/utils'; // Hàm merge class của bạn

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <FaThLarge /> },
    { path: "/shops", name: "Cửa Hàng", icon: <FaStore /> },
    { path: "/products", name: "Sản Phẩm", icon: <FaBox /> },
    { path: "/employees", name: "Nhân Viên", icon: <FaUserTie /> },
    { path: "/orders", name: "Đơn Hàng", icon: <FaShoppingCart /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- SIDEBAR MÀU TỐI --- */}
      <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-all">
        
        {/* Logo Area */}
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-accent-foreground">Store Manager</h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium',
                  isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-teal-500/30' // Active: Màu xanh ngọc + bóng đổ
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'   // Normal: Màu xám nhạt
                )}  
              >
                <span className="text-lg">{item.icon}</span> 
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer (Dark Mode) */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar-accent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-ring flex items-center justify-center text-sidebar-foreground font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-sidebar-foreground">Admin User</p>
              <p className="text-xs text-slate-400">admin@store.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-x-auto overflow-y-auto">
        <header className='h-16 flex items-center px-6 border-b border-gray-300'></header>
        <div className='p-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;