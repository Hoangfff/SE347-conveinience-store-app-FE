import React, { useRef, useEffect } from "react";
import {Header} from "../../components/ui/header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {SearchBar} from "../../components/ui/searchbar";

import { FaEdit, FaTrashAlt } from "react-icons/fa";
const orders = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    store: "Cửa hàng Q1",
    items: 3,
    total: "2,450,000đ",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Trần Thị B",
    store: "Cửa hàng Q2",
    items: 2,
    total: "1,890,000đ",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Lê Văn C",
    store: "Cửa hàng Q3",
    items: 5,
    total: "3,250,000đ",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Phạm Thị D",
    store: "Cửa hàng Q1",
    items: 1,
    total: "980,000đ",
    status: "processing",
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "Hoàng Văn E",
    store: "Cửa hàng Q2",
    items: 4,
    total: "2,150,000đ",
    status: "completed",
    date: "2024-01-13",
  },
  {
    id: "ORD-006",
    customer: "Vũ Thị F",
    store: "Cửa hàng Q3",
    items: 2,
    total: "1,600,000đ",
    status: "cancelled",
    date: "2024-01-13",
  },
  {
    id: "ORD-007",
    customer: "Đặng Văn G",
    store: "Cửa hàng Q1",
    items: 3,
    total: "2,800,000đ",
    status: "processing",
    date: "2024-01-12",
  },
  {
    id: "ORD-008",
    customer: "Bùi Thị H",
    store: "Cửa hàng Q2",
    items: 1,
    total: "750,000đ",
    status: "completed",
    date: "2024-01-12",
  },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "completed":
      return (
        <div>
            <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                Hoàn thành
            </Badge>
        </div>
      );
    case "pending":
      return (
        <div>
            <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                Đang chờ xử lý
            </Badge>
        </div>
      );
    case "processing":
        return (
        <div>
            <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Đang xử lý
            </Badge>
        </div>
        );
    default: // inactive
      return (
        <div>
            <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                Đã hủy
            </Badge>
        </div>
      );
  }
};

export default function Orders() { 
    return(
        <div className="space-y-8">
            <header className="flex justify-between h-16 ">
                <div>
                    <Header>Orders</Header>
                    <span className="text-sm text-slate-600 italic">Danh sách các đơn hàng</span>
                </div>
                <Button>+ Thêm đơn hàng mới</Button>
            </header>
            <SearchBar placeholder="Tìm kiếm đơn hàng"></SearchBar>
            <Card>
                <CardContent className="p-0">
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                        <table className="min-w-full border border-slate-600">
                            <thead className="bg-gray-200">
                                <tr className="border-b h-3">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Tên Khách Hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Cửa Hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Số Lượng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Tổng Tiền</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Ngày Đặt</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-card-content/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold">{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{order.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.store}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{order.items} sản phẩm</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 font-medium">{order.total}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(order.status)}</td>
                                        <td>
                                            <div>
                                                <Button variant="ghost">
                                                    <FaEdit size={10}/>    
                                                </Button> 
                                                <Button variant="ghost">
                                                    <FaTrashAlt size={10}/>    
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div> 
    );        
}