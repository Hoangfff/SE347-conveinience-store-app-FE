import React, {useState} from "react";
import {Header} from "../../components/ui/header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {SearchBar} from "../../components/ui/searchbar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Modal from "../../components/ui/modal";

const products = [
  {
    id: 1, 
    name: "Sữa tươi Vinamilk",
    category: "Đồ uống",
    price: "25,000đ",
    stock: 120,
    status: "active",
    image: "🥛",
  },
    {
    id: 2, 
    name: "Bánh mì Việt Nam",
    category: "Thực phẩm", 
    price: "15,000đ",
    stock: 80,
    status: "active",
    image: "🍞"
  }
  // Thêm nhiều sản phẩm hơn nếu cần
];

export default function Products() {
    // 2. Tạo State để quản lý Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State lưu dữ liệu form (để gửi lên server sau này)
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
    });

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Lưu sản phẩm:", formData);
        // Gọi API save tại đây...
        
        setIsModalOpen(false); // Đóng modal sau khi lưu
        alert("Đã thêm sản phẩm thành công!");
    };
    return (
        <div className="space-y-8">
            <header className="flex justify-between">
                <div>
                    <Header>Quản Lý Sản Phẩm</Header>
                    <span className="italic">Danh sách sản phẩm trong chuỗi cửa hàng</span>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    +Thêm sản phẩm mới
                </Button>
            </header>
            <SearchBar placeholder="Tìm kiếm sản phẩm"></SearchBar>
            <main className="grid grid-cols-4 gap-4">
                {products.map((product) => (
                    <Card key={product.id}>
                        <CardContent className="flex flex-col items-center space-y-4 p-6">
                            <div className="text-6xl">{product.image}</div>
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-sm text-slate-600">{product.category}</p>
                            <p className="text-blue-600 font-medium">{product.price}</p>
                            <p className="text-sm">Còn lại: {product.stock} sản phẩm</p>
                            <div className="flex space-x-4">
                                <Button variant="outline" size="sm">
                                    <FaEdit className="mr-2" /> Sửa
                                </Button>
                                <Button variant="destructive" size="sm">
                                    <FaTrashAlt className="mr-2" /> Xóa
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </main>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Thêm sản phẩm mới"
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Tên sản phẩm</label>
                        <input 
                            placeholder="Ví dụ: Bánh Oreo" 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Danh mục</label>
                        <select className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            <option>Đồ uống</option>
                            <option>Thực phẩm</option>
                            <option>Vật dụng</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Giá bán</label>
                            <input
                                type="number" 
                                placeholder="0" 
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Số lượng nhập vào</label>
                            <input
                                type="number"
                                placeholder="0"
                                onChange={(e) => setFormData({...formData,stock: e.target.value})}
                                className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Trạng thái</label>
                        
                        <div className="flex items-center gap-6 mt-2">
                            {/* Lựa chọn 1: Đang bán */}
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    id="status-active"
                                    name="status"
                                    value="active"
                                    checked={formData.status === "active"}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor="status-active" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Đang bán
                                </label>
                            </div>

                            {/* Lựa chọn 2: Ngừng bán */}
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    id="status-inactive"
                                    name="status"
                                    value="inactive"
                                    checked={formData.status === "inactive"}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                />
                                <label htmlFor="status-inactive" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Ngừng bán
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit">
                            Lưu sản phẩm
                        </Button>
                    </div>
                </form>
            </Modal>    
        </div>
    )}