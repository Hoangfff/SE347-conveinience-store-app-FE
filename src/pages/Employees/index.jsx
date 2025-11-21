import React, { useRef, useEffect } from "react";
import {Header} from "../../components/ui/header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {SearchBar} from "../../components/ui/searchbar";

import { FaEdit, FaTrashAlt } from "react-icons/fa";
const employees = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901 234 567",
    position: "Quản lý cửa hàng",
    store: "Cửa hàng Q1",
    status: "active",
    avatar: "👨",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0902 345 678",
    position: "Nhân viên bán hàng",
    store: "Cửa hàng Q1",
    status: "active",
    avatar: "👩",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0903 456 789",
    position: "Thủ kho",
    store: "Cửa hàng Q2",
    status: "active",
    avatar: "👨",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0904 567 890",
    position: "Nhân viên bán hàng",
    store: "Cửa hàng Q3",
    status: "on_leave",
    avatar: "👩",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0905 678 901",
    position: "Quản lý cửa hàng",
    store: "Cửa hàng Q2",
    status: "active",
    avatar: "👨",
  },
  {
    id: 6,
    name: "Vũ Thị F",
    email: "vuthif@email.com",
    phone: "0906 789 012",
    position: "Nhân viên bán hàng",
    store: "Cửa hàng Q2",
    status: "active",
    avatar: "👩",
  },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return (
        <div>
            <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
            Đang làm
            </Badge>
        </div>
      );
    case "on_leave":
      return (
        <div>
            <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
            Nghỉ phép
            </Badge>
        </div>
      );
    default: // inactive
      return (
        <div>
            <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                Đã nghỉ
            </Badge>
        </div>
      );
  }
};

export default function Employee() { 
    return(
        <div className="space-y-8">
            <header className="flex justify-between h-16 ">
                <div>
                    <Header>Employee Page</Header>
                    <span className="text-sm text-slate-600 italic">Danh sách các nhân viên</span>
                </div>
                <Button>+ Thêm nhân viên</Button>
            </header>
            <SearchBar placeholder="Tìm kiếm nhân viên"></SearchBar>
            <Card>
                <CardContent className="p-0">
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                        <table className="min-w-full border border-slate-600">
                            <thead className="bg-gray-200">
                                <tr className="border-b h-3">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Tên</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Số điện thoại</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Chức vụ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Cửa hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-card-content uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-card-content/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-medium">{employee.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold">{employee.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{employee.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{employee.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{employee.position}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{employee.store}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(employee.status)}</td>
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