import React, { useMemo, useState } from "react";
import { Header } from "../../components/ui/header";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { SearchBar } from "../../components/ui/searchbar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const initialShops = [
  {
    id: "SHP-001",
    name: "Cửa hàng Q1",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    employees: 12,
    products: 420,
    orders: 1342,
  },
  {
    id: "SHP-002",
    name: "Cửa hàng Q2",
    address: "45 Nguyễn Trãi, Quận 5, TP.HCM",
    employees: 8,
    products: 278,
    orders: 860,
  },
  {
    id: "SHP-003",
    name: "Cửa hàng Q3",
    address: "9 Trần Hưng Đạo, Quận 3, TP.HCM",
    employees: 6,
    products: 190,
    orders: 450,
  },
];

export default function Shops() {
  const [shops, setShops] = useState(initialShops);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shops;
    return shops.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }, [shops, query]);

  const handleDelete = (id) => {
    if (!confirm("Xóa cửa hàng này?")) return;
    setShops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEdit = (id) => {
    // place-holder: replace with navigation to edit form/modal
    alert(`Sửa cửa hàng ${id}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <Header>Quản Lý Cửa Hàng</Header>
          <span className="text-sm text-slate-600 italic">Danh sách các cửa hàng</span>
        </div>
        <div className="flex items-center gap-2">
          <Button>+ Thêm cửa hàng</Button>
        </div>
      </header>

      <div className="flex justify-between items-center">
        <SearchBar
          placeholder="Tìm kiếm theo id, tên hoặc địa chỉ"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="text-sm text-slate-500">{filtered.length} kết quả</div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr className="text-left">
                  <th className="px-6 py-3 text-xs font-medium text-card-content uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-card-content uppercase tracking-wider">Tên</th>
                  <th className="px-6 py-3 text-xs font-medium text-card-content uppercase tracking-wider">Địa chỉ</th>
                  <th className="px-6 py-3 text-xs font-medium text-card-content uppercase tracking-wider">Nhân viên</th>
                  <th className="px-6 py-3 text-xs font-medium text-card-content uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-6 py-3 text-xs font-medium text-card-content uppercase tracking-wider">Đơn hàng</th>
                  <th className="px-6 py-3 text-xs font-medium text-card-content uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((shop) => (
                  <tr key={shop.id} className="hover:bg-card-content/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{shop.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{shop.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{shop.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{shop.employees}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{shop.products}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{shop.orders}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => handleEdit(shop.id)}>
                          <FaEdit />
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(shop.id)}>
                          <FaTrashAlt />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                      Không tìm thấy cửa hàng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}