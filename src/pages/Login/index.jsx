import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // placeholder: call auth API
    alert(`Đăng nhập: ${username}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Đăng nhập</h1>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Tên đăng nhập"
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