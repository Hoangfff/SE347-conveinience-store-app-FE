import React, { useState } from "react";
import { Header } from "../../components/ui/header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { SearchBar } from "../../components/ui/searchbar";
import Modal from "../../components/ui/modal";
import { FaPlus, FaTruck, FaBoxOpen, FaArrowRight, FaCheck, FaEye, FaExclamationTriangle } from "react-icons/fa";

// Dummy stores
const stores = [
    { id: "SHP-001", name: "Cửa hàng Q1" },
    { id: "SHP-002", name: "Cửa hàng Q7" },
    { id: "SHP-003", name: "Cửa hàng Q3" },
];

// Dummy products with stock per store
const products = [
    { id: 1, sku: "SKU-001", name: "Sữa tươi Vinamilk 1L", stock: { "SHP-001": 50, "SHP-002": 30, "SHP-003": 20 } },
    { id: 2, sku: "SKU-002", name: "Coca-Cola 330ml", stock: { "SHP-001": 100, "SHP-002": 80, "SHP-003": 60 } },
    { id: 3, sku: "SKU-003", name: "Bánh Oreo", stock: { "SHP-001": 30, "SHP-002": 25, "SHP-003": 15 } },
    { id: 4, sku: "SKU-004", name: "Mì gói Hảo Hảo", stock: { "SHP-001": 200, "SHP-002": 150, "SHP-003": 100 } },
];

// Initial transfers
const initialTransfers = [
    {
        id: "TRF-001",
        createdDate: "2026-01-10",
        fromStore: "SHP-001",
        toStore: "SHP-002",
        status: "received",
        items: [
            { productId: 1, name: "Sữa tươi Vinamilk 1L", sku: "SKU-001", quantity: 20, receivedQty: 20 },
        ],
        note: "Bổ sung hàng cho Q7",
        createdBy: "Admin",
    },
    {
        id: "TRF-002",
        createdDate: "2026-01-11",
        fromStore: "SHP-001",
        toStore: "SHP-003",
        status: "shipped",
        items: [
            { productId: 2, name: "Coca-Cola 330ml", sku: "SKU-002", quantity: 30, receivedQty: 0 },
            { productId: 3, name: "Bánh Oreo", sku: "SKU-003", quantity: 10, receivedQty: 0 },
        ],
        note: "",
        createdBy: "Manager",
    },
    {
        id: "TRF-003",
        createdDate: "2026-01-11",
        fromStore: "SHP-002",
        toStore: "SHP-001",
        status: "pending",
        items: [
            { productId: 4, name: "Mì gói Hảo Hảo", sku: "SKU-004", quantity: 50, receivedQty: 0 },
        ],
        note: "Điều chuyển định kỳ",
        createdBy: "Admin",
    },
];

const getStatusBadge = (status) => {
    switch (status) {
        case "pending":
            return <Badge className="bg-yellow-100 text-yellow-700">Chờ gửi</Badge>;
        case "shipped":
            return <Badge className="bg-blue-100 text-blue-700">Đang vận chuyển</Badge>;
        case "received":
            return <Badge className="bg-green-100 text-green-700">Đã nhận</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
};

const Transfer = () => {
    const [transfers, setTransfers] = useState(initialTransfers);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        fromStore: "",
        toStore: "",
        note: "",
        items: [{ productId: "", quantity: "" }],
    });

    // Receive state
    const [receiveData, setReceiveData] = useState([]);

    // Filter transfers
    const filteredTransfers = transfers.filter((t) => {
        const matchSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = !filterStatus || t.status === filterStatus;
        return matchSearch && matchStatus;
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            fromStore: "",
            toStore: "",
            note: "",
            items: [{ productId: "", quantity: "" }],
        });
        setFormErrors({});
    };

    // Add item
    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { productId: "", quantity: "" }],
        });
    };

    // Remove item
    const removeItem = (index) => {
        if (formData.items.length === 1) return;
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        });
    };

    // Update item
    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    // Get available stock for selected store
    const getAvailableStock = (productId, storeId) => {
        const product = products.find((p) => p.id.toString() === productId);
        return product?.stock[storeId] || 0;
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.fromStore) errors.fromStore = "Chọn cửa hàng gửi";
        if (!formData.toStore) errors.toStore = "Chọn cửa hàng nhận";
        if (formData.fromStore === formData.toStore && formData.fromStore) {
            errors.toStore = "Cửa hàng nhận phải khác cửa hàng gửi";
        }

        const itemErrors = [];
        formData.items.forEach((item, index) => {
            const iErrors = {};
            if (!item.productId) iErrors.productId = "Chọn sản phẩm";
            if (!item.quantity || parseInt(item.quantity) <= 0) {
                iErrors.quantity = "Số lượng > 0";
            } else {
                const stock = getAvailableStock(item.productId, formData.fromStore);
                if (parseInt(item.quantity) > stock) {
                    iErrors.quantity = `Không đủ tồn (còn ${stock})`;
                }
            }
            if (Object.keys(iErrors).length > 0) itemErrors[index] = iErrors;
        });

        if (itemErrors.some((e) => e)) errors.items = itemErrors;
        return errors;
    };

    // Create transfer
    const handleCreateTransfer = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const newTransfer = {
            id: `TRF-${String(transfers.length + 1).padStart(3, "0")}`,
            createdDate: new Date().toISOString().split("T")[0],
            fromStore: formData.fromStore,
            toStore: formData.toStore,
            status: "pending",
            items: formData.items.map((item) => {
                const product = products.find((p) => p.id.toString() === item.productId);
                return {
                    productId: parseInt(item.productId),
                    name: product?.name,
                    sku: product?.sku,
                    quantity: parseInt(item.quantity),
                    receivedQty: 0,
                };
            }),
            note: formData.note,
            createdBy: "Admin",
        };

        setTransfers([newTransfer, ...transfers]);
        setIsCreateModalOpen(false);
        resetForm();
    };

    // Ship transfer
    const handleShipTransfer = (transfer) => {
        if (window.confirm(`Xác nhận gửi hàng cho ${transfer.id}?`)) {
            setTransfers(transfers.map((t) => (t.id === transfer.id ? { ...t, status: "shipped" } : t)));
        }
    };

    // Open receive modal
    const openReceiveModal = (transfer) => {
        setSelectedTransfer(transfer);
        setReceiveData(transfer.items.map((item) => ({
            ...item,
            receivedQty: item.quantity.toString(),
        })));
        setIsReceiveModalOpen(true);
    };

    // Receive transfer
    const handleReceiveTransfer = (e) => {
        e.preventDefault();
        const updatedTransfer = {
            ...selectedTransfer,
            status: "received",
            items: receiveData.map((item) => ({
                ...item,
                receivedQty: parseInt(item.receivedQty),
            })),
        };

        setTransfers(transfers.map((t) => (t.id === selectedTransfer.id ? updatedTransfer : t)));
        setIsReceiveModalOpen(false);
        setSelectedTransfer(null);
    };

    // View detail
    const handleViewDetail = (transfer) => {
        setSelectedTransfer(transfer);
        setIsDetailModalOpen(true);
    };

    // Get store name
    const getStoreName = (id) => stores.find((s) => s.id === id)?.name || id;

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex justify-between items-start">
                <div>
                    <Header>Chuyển kho</Header>
                    <span className="italic text-gray-500">Chuyển hàng hóa giữa các cửa hàng</span>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <FaPlus className="mr-2" /> Tạo yêu cầu chuyển
                </Button>
            </header>

            {/* Toolbar */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Tìm theo mã chuyển kho..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-md border px-3 py-2 text-sm"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ gửi</option>
                    <option value="shipped">Đang vận chuyển</option>
                    <option value="received">Đã nhận</option>
                </select>
            </div>

            {/* Transfer Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-600">Mã</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Ngày tạo</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Từ</th>
                                    <th className="text-center p-4 font-medium text-gray-600"></th>
                                    <th className="text-left p-4 font-medium text-gray-600">Đến</th>
                                    <th className="text-center p-4 font-medium text-gray-600">Số SP</th>
                                    <th className="text-center p-4 font-medium text-gray-600">Trạng thái</th>
                                    <th className="text-center p-4 font-medium text-gray-600">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredTransfers.map((transfer) => (
                                    <tr key={transfer.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono font-medium text-blue-600">{transfer.id}</td>
                                        <td className="p-4 text-gray-600">{transfer.createdDate}</td>
                                        <td className="p-4">{getStoreName(transfer.fromStore)}</td>
                                        <td className="p-4 text-center">
                                            <FaArrowRight className="text-gray-400 inline" />
                                        </td>
                                        <td className="p-4">{getStoreName(transfer.toStore)}</td>
                                        <td className="p-4 text-center">{transfer.items.length}</td>
                                        <td className="p-4 text-center">{getStatusBadge(transfer.status)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(transfer)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye />
                                                </button>

                                                {transfer.status === "pending" && (
                                                    <button
                                                        onClick={() => handleShipTransfer(transfer)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        title="Gửi hàng"
                                                    >
                                                        <FaTruck />
                                                    </button>
                                                )}

                                                {transfer.status === "shipped" && (
                                                    <button
                                                        onClick={() => openReceiveModal(transfer)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                        title="Nhận hàng"
                                                    >
                                                        <FaBoxOpen />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTransfers.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="p-8 text-center text-gray-500">
                                            Chưa có yêu cầu chuyển kho
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Create Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Tạo yêu cầu chuyển kho">
                <form onSubmit={handleCreateTransfer} className="space-y-4">
                    {/* Stores */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Cửa hàng gửi *</label>
                            <select
                                value={formData.fromStore}
                                onChange={(e) => setFormData({ ...formData, fromStore: e.target.value })}
                                className={`w-full rounded-md border px-3 py-2 text-sm ${formErrors.fromStore ? "border-red-500" : ""}`}
                            >
                                <option value="">Chọn cửa hàng</option>
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>{store.name}</option>
                                ))}
                            </select>
                            {formErrors.fromStore && <p className="text-red-500 text-xs mt-1">{formErrors.fromStore}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Cửa hàng nhận *</label>
                            <select
                                value={formData.toStore}
                                onChange={(e) => setFormData({ ...formData, toStore: e.target.value })}
                                className={`w-full rounded-md border px-3 py-2 text-sm ${formErrors.toStore ? "border-red-500" : ""}`}
                            >
                                <option value="">Chọn cửa hàng</option>
                                {stores.filter((s) => s.id !== formData.fromStore).map((store) => (
                                    <option key={store.id} value={store.id}>{store.name}</option>
                                ))}
                            </select>
                            {formErrors.toStore && <p className="text-red-500 text-xs mt-1">{formErrors.toStore}</p>}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Sản phẩm chuyển</h4>
                            <Button type="button" size="sm" onClick={addItem}>
                                <FaPlus className="mr-1" /> Thêm
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {formData.items.map((item, index) => {
                                const stock = getAvailableStock(item.productId, formData.fromStore);
                                return (
                                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                                        <div className="col-span-6">
                                            <select
                                                value={item.productId}
                                                onChange={(e) => updateItem(index, "productId", e.target.value)}
                                                className={`w-full rounded-md border px-2 py-1.5 text-sm ${formErrors.items?.[index]?.productId ? "border-red-500" : ""
                                                    }`}
                                            >
                                                <option value="">Chọn sản phẩm</option>
                                                {products.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                                placeholder="SL"
                                                min="1"
                                                className={`w-full rounded-md border px-2 py-1.5 text-sm ${formErrors.items?.[index]?.quantity ? "border-red-500" : ""
                                                    }`}
                                            />
                                            {formData.fromStore && item.productId && (
                                                <p className="text-xs text-gray-500 mt-1">Tồn: {stock}</p>
                                            )}
                                        </div>
                                        <div className="col-span-3">
                                            {formData.items.length > 1 && (
                                                <button type="button" onClick={() => removeItem(index)} className="text-red-500 text-sm">
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Ghi chú</label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            rows={2}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2 border-t">
                        <Button type="button" variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>
                            Hủy
                        </Button>
                        <Button type="submit">Tạo yêu cầu</Button>
                    </div>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title={`Chi tiết ${selectedTransfer?.id}`}>
                {selectedTransfer && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Từ cửa hàng</p>
                                <p className="font-medium">{getStoreName(selectedTransfer.fromStore)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Đến cửa hàng</p>
                                <p className="font-medium">{getStoreName(selectedTransfer.toStore)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Ngày tạo</p>
                                <p className="font-medium">{selectedTransfer.createdDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Trạng thái</p>
                                {getStatusBadge(selectedTransfer.status)}
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-medium mb-2">Danh sách sản phẩm</h4>
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-2">SKU</th>
                                        <th className="text-left p-2">Tên SP</th>
                                        <th className="text-right p-2">SL chuyển</th>
                                        {selectedTransfer.status === "received" && (
                                            <th className="text-right p-2">SL nhận</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {selectedTransfer.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="p-2 font-mono">{item.sku}</td>
                                            <td className="p-2">{item.name}</td>
                                            <td className="p-2 text-right">{item.quantity}</td>
                                            {selectedTransfer.status === "received" && (
                                                <td className="p-2 text-right text-green-600">{item.receivedQty}</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {selectedTransfer.note && (
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-600">Ghi chú: {selectedTransfer.note}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Receive Modal */}
            <Modal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)} title={`Nhận hàng - ${selectedTransfer?.id}`}>
                {selectedTransfer && (
                    <form onSubmit={handleReceiveTransfer} className="space-y-4">
                        <div className="p-3 bg-green-50 rounded-lg flex items-center gap-2">
                            <FaBoxOpen className="text-green-600" />
                            <p className="text-sm text-green-800">Nhập số lượng thực tế nhận được</p>
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-2">Sản phẩm</th>
                                    <th className="text-right p-2">SL chuyển</th>
                                    <th className="text-right p-2">SL nhận</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {receiveData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-2">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.sku}</p>
                                        </td>
                                        <td className="p-2 text-right text-gray-600">{item.quantity}</td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                value={item.receivedQty}
                                                onChange={(e) => {
                                                    const newData = [...receiveData];
                                                    newData[index].receivedQty = e.target.value;
                                                    setReceiveData(newData);
                                                }}
                                                className="w-20 rounded-md border px-2 py-1 text-sm text-right float-right"
                                                min="0"
                                                max={item.quantity}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pt-4 flex justify-end gap-2 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsReceiveModalOpen(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                <FaCheck className="mr-2" /> Xác nhận nhận hàng
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Transfer;
