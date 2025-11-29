import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import bgImage from "../../assets/bg.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setUsername(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validate empty fields
    if (!username.trim()) {
      setError("Vui lòng nhập tên đăng nhập hoặc email");
      return;
    }

    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    // Validate email format
    if (!isValidEmail(username)) {
      setError("Email không hợp lệ");
      return;
    }

    // Extract name from email (part before @)
    const name = username.split('@')[0].toLowerCase();

    // Save or remove email based on remember me checkbox
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", username);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    // Role-based routing
    if (name === "admin") {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      navigate("/admin");
    } else if (name === "employee") {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'employee');
      navigate("/employee");
    } else {
      setError("Tài khoản không hợp lệ. Vui lòng sử dụng admin@... hoặc employee@...");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center h-screen p-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay to gray out the background */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      />

      <Card className="max-w-md w-full relative z-10">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Đăng nhập</h1>

          <form onSubmit={submit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="admin@store.com hoặc employee@store.com"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Mật khẩu"
                autoComplete="current-password"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="remember-me" className="text-sm text-gray-700 cursor-pointer">
                Ghi nhớ tôi
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button type="submit">Đăng nhập</Button>
              <Button variant="ghost" onClick={() => alert("Store Manager v1.0\nỨng dụng quản lý cửa hàng.")}>
                About
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;