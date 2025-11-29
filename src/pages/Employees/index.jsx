import React, { useRef, useEffect, useState } from "react";
import { Header } from "../../components/ui/header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { SearchBar } from "../../components/ui/searchbar";
import Modal from "../../components/ui/modal";

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State lưu dữ liệu form (để gửi lên server sau này)
    const [formData, setFormData] = useState({
        id: 6,
        name: "",
        email: "",
        phone: "",
        position: "",
        store: "",
        status: "",
        avatar: "",
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
            <header className="flex justify-between h-16 ">
                <div>
                    <Header>Employee Page</Header>
                    <span className="text-sm text-slate-600 italic">Danh sách các nhân viên</span>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>+ Thêm nhân viên</Button>
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
                                                    <FaEdit size={10} />
                                                </Button>
                                                <Button variant="ghost">
                                                    <FaTrashAlt size={10} />
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Thêm nhân viên mới"
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">ID nhân viên</label>
                        <input
                            placeholder="Ví dụ: 23521719"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tên Nhân Viên</label>
                        <input
                            type="text"
                            placeholder="Ví dụ: Nguyễn Hoàng Tuấn"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                            placeholder="Ví dụ: 23521719@gm.uit.edu.vn"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Số Điện Thoại</label>
                        <input
                            placeholder="Ví dụ: 0862318328"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Vị trí</label>
                        <select className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            <option>Quản lý</option>
                            <option>Nhân viên</option>
                            <option>Kế toán</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Trạng thái</label>

                        <div className="flex items-center gap-6 mt-2">
                            {/* Lựa chọn 1: Đang làm */}
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
                                    Đang làm
                                </label>
                            </div>

                            {/* Lựa chọn 2: Nghỉ làm */}
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
                                    Nghỉ việc
                                </label>
                            </div>
                            {/* Lựa chọn 3: Nghỉ phép */}
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    id="status-on-leave"
                                    name="status"
                                    value="on-leave"
                                    checked={formData.status === "on-leave"}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                />
                                <label htmlFor="status-on-leave" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Nghỉ phép
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit">
                            Lưu
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}