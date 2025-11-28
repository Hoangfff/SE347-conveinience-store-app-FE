import React, { useMemo, useState } from "react";
import { Header } from "../../components/ui/header";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { SearchBar } from "../../components/ui/searchbar";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import Modal from "../../components/ui/modal";

// Mock data for employees  
const availableEmployees = [
  { id: "EMP-001", name: "Nguyễn Văn A", position: "Quản lý" },
  { id: "EMP-002", name: "Trần Thị B", position: "Thu ngân" },
  { id: "EMP-003", name: "Lê Văn C", position: "Bảo vệ" },
  { id: "EMP-004", name: "Phạm Thị D", position: "Nhân viên kho" },
  { id: "EMP-005", name: "Hoàng Văn E", position: "Thu ngân" },
];

// Mock data for products
const availableProducts = [
  { id: "PRD-001", name: "Sữa tươi Vinamilk", category: "Đồ uống" },
  { id: "PRD-002", name: "Bánh mì Việt Nam", category: "Thực phẩm" },
  { id: "PRD-003", name: "Nước ngọt Coca Cola", category: "Đồ uống" },
  { id: "PRD-004", name: "Mì gói Hảo Hảo", category: "Thực phẩm" },
  { id: "PRD-005", name: "Kem đánh răng P/S", category: "Vật dụng" },
];

const initialShops = [
  {
    id: "SHP-001",
    name: "Cửa hàng Q1",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    employees: 12,
    products: 420,
    orders: 1342,
    employeeList: ["EMP-001", "EMP-002", "EMP-003"],
    productList: [
      { id: "PRD-001", amount: 50 },
      { id: "PRD-002", amount: 100 },
      { id: "PRD-003", amount: 75 },
    ],
    orderList: [
      { id: "ORD-001", customer: "Khách hàng A", total: "250,000đ", date: "2024-01-15" },
      { id: "ORD-002", customer: "Khách hàng B", total: "150,000đ", date: "2024-01-16" },
    ],
  },
  {
    id: "SHP-002",
    name: "Cửa hàng Q2",
    address: "45 Nguyễn Trãi, Quận 5, TP.HCM",
    employees: 8,
    products: 278,
    orders: 860,
    employeeList: ["EMP-004", "EMP-005"],
    productList: [
      { id: "PRD-004", amount: 30 },
      { id: "PRD-005", amount: 60 },
    ],
    orderList: [
      { id: "ORD-003", customer: "Khách hàng C", total: "320,000đ", date: "2024-01-17" },
    ],
  },
  {
    id: "SHP-003",
    name: "Cửa hàng Q3",
    address: "9 Trần Hưng Đạo, Quận 3, TP.HCM",
    employees: 6,
    products: 190,
    orders: 450,
    employeeList: ["EMP-001"],
    productList: [
      { id: "PRD-001", amount: 25 },
    ],
    orderList: [],
  },
];

export default function Shops() {
  const [shops, setShops] = useState(initialShops);
  const [query, setQuery] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  // Form data for adding/editing shop
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    selectedEmployees: [],
    selectedProducts: [],
  });

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

  const handleEdit = (shop) => {
    // Pre-populate form with shop data
    setFormData({
      name: shop.name,
      address: shop.address,
      selectedEmployees: shop.employeeList || [],
      selectedProducts: shop.productList || [],
    });
    setSelectedShop(shop);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (shop) => {
    setSelectedShop(shop);
    setIsDetailsModalOpen(true);
  };

  const handleAddShop = (e) => {
    e.preventDefault();

    // Create new shop object
    const newShop = {
      id: `SHP-${String(shops.length + 1).padStart(3, '0')}`,
      name: formData.name,
      address: formData.address,
      employees: formData.selectedEmployees.length,
      products: formData.selectedProducts.reduce((sum, p) => sum + (p.amount || 0), 0),
      orders: 0,
      employeeList: formData.selectedEmployees,
      productList: formData.selectedProducts,
      orderList: [],
    };

    setShops((prev) => [...prev, newShop]);
    setIsAddModalOpen(false);

    // Reset form
    setFormData({
      name: "",
      address: "",
      selectedEmployees: [],
      selectedProducts: [],
    });

    alert("Đã thêm cửa hàng thành công!");
  };

  const handleUpdateShop = (e) => {
    e.preventDefault();

    // Update shop object
    const updatedShop = {
      ...selectedShop,
      name: formData.name,
      address: formData.address,
      employees: formData.selectedEmployees.length,
      products: formData.selectedProducts.reduce((sum, p) => sum + (p.amount || 0), 0),
      employeeList: formData.selectedEmployees,
      productList: formData.selectedProducts,
    };

    setShops((prev) => prev.map((shop) =>
      shop.id === selectedShop.id ? updatedShop : shop
    ));
    setIsEditModalOpen(false);

    // Reset form
    setFormData({
      name: "",
      address: "",
      selectedEmployees: [],
      selectedProducts: [],
    });
    setSelectedShop(null);

    alert("Đã cập nhật cửa hàng thành công!");
  };

  const toggleEmployee = (empId) => {
    setFormData((prev) => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(empId)
        ? prev.selectedEmployees.filter((id) => id !== empId)
        : [...prev.selectedEmployees, empId],
    }));
  };

  const toggleProduct = (prdId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedProducts.some((p) => p.id === prdId);
      if (isSelected) {
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.filter((p) => p.id !== prdId),
        };
      } else {
        return {
          ...prev,
          selectedProducts: [...prev.selectedProducts, { id: prdId, amount: 0 }],
        };
      }
    });
  };

  const updateProductAmount = (prdId, amount) => {
    setFormData((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.map((p) =>
        p.id === prdId ? { ...p, amount: parseInt(amount) || 0 } : p
      ),
    }));
  };

  // Render the form (used by both Add and Edit modals)
  const renderForm = (onSubmit, buttonText) => (
    <form onSubmit={onSubmit}>
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên cửa hàng *</label>
              <input
                required
                placeholder="Ví dụ: Cửa hàng Q7"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa chỉ *</label>
              <input
                required
                placeholder="Ví dụ: 123 Đường ABC, Quận 7, TP.HCM"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Employees Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn nhân viên</label>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
                {availableEmployees.map((emp) => (
                  <div key={emp.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`emp-${emp.id}`}
                      checked={formData.selectedEmployees.includes(emp.id)}
                      onChange={() => toggleEmployee(emp.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`emp-${emp.id}`} className="text-sm cursor-pointer flex-1">
                      {emp.name} - {emp.position}
                    </label>
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-500">
                Đã chọn: {formData.selectedEmployees.length} nhân viên
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Products Selection with Amounts */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn sản phẩm và số lượng</label>
              <div className="max-h-[28rem] overflow-y-auto border rounded-lg p-3 space-y-3">
                {availableProducts.map((prd) => {
                  const selectedProduct = formData.selectedProducts.find((p) => p.id === prd.id);
                  const isSelected = !!selectedProduct;

                  return (
                    <div key={prd.id} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`prd-${prd.id}`}
                          checked={isSelected}
                          onChange={() => toggleProduct(prd.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`prd-${prd.id}`} className="text-sm cursor-pointer flex-1">
                          {prd.name} ({prd.category})
                        </label>
                      </div>
                      {isSelected && (
                        <div className="ml-6 flex items-center gap-2">
                          <label className="text-xs text-slate-600">Số lượng:</label>
                          <input
                            type="number"
                            min="0"
                            value={selectedProduct.amount}
                            onChange={(e) => updateProductAmount(prd.id, e.target.value)}
                            className="w-24 h-8 rounded-md border border-border px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-slate-500">
                Đã chọn: {formData.selectedProducts.length} sản phẩm
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex justify-end gap-2 border-t mt-4 sticky bottom-0 bg-white">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setFormData({ name: "", address: "", selectedEmployees: [], selectedProducts: [] });
          }}
        >
          Hủy bỏ
        </Button>
        <Button type="submit">
          {buttonText}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <Header>Quản Lý Cửa Hàng</Header>
          <span className="text-sm text-slate-600 italic">Danh sách các cửa hàng</span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsAddModalOpen(true)}>+ Thêm cửa hàng</Button>
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
                        <Button variant="ghost" onClick={() => handleViewDetails(shop)} title="Xem chi tiết">
                          <FaEye />
                        </Button>
                        <Button variant="ghost" onClick={() => handleEdit(shop)}>
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

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={`Chi tiết - ${selectedShop?.name || ""}`}
        className="max-w-3xl"
      >
        {selectedShop && (
          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto space-y-6 pr-2">
            {/* Shop Basic Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">ID:</span> <span className="font-medium">{selectedShop.id}</span>
                </div>
                <div>
                  <span className="text-slate-600">Tên:</span> <span className="font-medium">{selectedShop.name}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-600">Địa chỉ:</span> <span className="font-medium">{selectedShop.address}</span>
                </div>
              </div>
            </div>

            {/* Employees List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Nhân viên ({selectedShop.employeeList?.length || 0})</h3>
              <div className="max-h-40 overflow-y-auto border rounded-lg">
                {selectedShop.employeeList && selectedShop.employeeList.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Tên</th>
                        <th className="px-4 py-2 text-left">Chức vụ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedShop.employeeList.map((empId) => {
                        const emp = availableEmployees.find((e) => e.id === empId);
                        return (
                          <tr key={empId} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{emp?.id}</td>
                            <td className="px-4 py-2">{emp?.name}</td>
                            <td className="px-4 py-2">{emp?.position}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-4 text-slate-500">Chưa có nhân viên</p>
                )}
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Sản phẩm ({selectedShop.productList?.length || 0})</h3>
              <div className="max-h-40 overflow-y-auto border rounded-lg">
                {selectedShop.productList && selectedShop.productList.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Tên</th>
                        <th className="px-4 py-2 text-left">Số lượng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedShop.productList.map((prd) => {
                        const product = availableProducts.find((p) => p.id === prd.id);
                        return (
                          <tr key={prd.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{product?.id}</td>
                            <td className="px-4 py-2">{product?.name}</td>
                            <td className="px-4 py-2">{prd.amount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-4 text-slate-500">Chưa có sản phẩm</p>
                )}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Đơn hàng ({selectedShop.orderList?.length || 0})</h3>
              <div className="max-h-40 overflow-y-auto border rounded-lg">
                {selectedShop.orderList && selectedShop.orderList.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Khách hàng</th>
                        <th className="px-4 py-2 text-left">Tổng tiền</th>
                        <th className="px-4 py-2 text-left">Ngày</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedShop.orderList.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{order.id}</td>
                          <td className="px-4 py-2">{order.customer}</td>
                          <td className="px-4 py-2">{order.total}</td>
                          <td className="px-4 py-2">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-4 text-slate-500">Chưa có đơn hàng</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end sticky bottom-0 bg-white border-t mt-4 -mx-2 px-2 pb-2">
              <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Shop Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({ name: "", address: "", selectedEmployees: [], selectedProducts: [] });
        }}
        title="Thêm cửa hàng mới"
        className="max-w-4xl"
      >
        {renderForm(handleAddShop, "Lưu cửa hàng")}
      </Modal>

      {/* Edit Shop Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setFormData({ name: "", address: "", selectedEmployees: [], selectedProducts: [] });
          setSelectedShop(null);
        }}
        title={`Sửa cửa hàng - ${selectedShop?.name || ""}`}
        className="max-w-4xl"
      >
        {renderForm(handleUpdateShop, "Cập nhật")}
      </Modal>
    </div>
  );
}