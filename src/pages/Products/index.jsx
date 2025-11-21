import React from "react";
import {Header} from "../../components/ui/header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {SearchBar} from "../../components/ui/searchbar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

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
    return (
        <div className="space-y-8">
            <header className="flex justify-between">
                <div>
                    <Header>Quản Lý Sản Phẩm</Header>
                    <span className="italic">Danh sách sản phẩm trong chuỗi cửa hàng</span>
                </div>
                <Button>+Thêm sản phẩm mới</Button>
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
        </div>
    )}