import React, { useState } from "react";
import { Header } from "../../components/ui/header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { SearchBar } from "../../components/ui/searchbar";
import Modal from "../../components/ui/modal";
import { FaPlus, FaEye, FaCheck, FaTruck, FaEdit, FaTrashAlt, FaBoxOpen } from "react-icons/fa";

// Dummy data
const stores = [
    { id: "SHP-001", name: "Cửa hàng Q1" },
    { id: "SHP-002", name: "Cửa hàng Q7" },
    { id: "SHP-003", name: "Cửa hàng Q3" },
];

const suppliers = [
    { id: "SUP-001", name: "Công ty Vinamilk", phone: "028 1234 5678" },
    { id: "SUP-002", name: "Coca-Cola Việt Nam", phone: "028 8765 4321" },
    { id: "SUP-003", name: "Đại lý Bánh kẹo ABC", phone: "028 1122 3344" },
];

const products = [
    { id: 1, sku: "SKU-001", name: "Sữa tươi Vinamilk 1L", unit: "Hộp", defaultCost: 28000 },
    { id: 2, sku: "SKU-002", name: "Coca-Cola 330ml", unit: "Lon", defaultCost: 9000 },
    { id: 3, sku: "SKU-003", name: "Bánh Oreo", unit: "Gói", defaultCost: 18000 },
    { id: 4, sku: "SKU-004", name: "Mì gói Hảo Hảo", unit: "Gói", defaultCost: 4000 },
];

// Initial POs
const initialPOs = [
    {
        id: "PO-001",
        createdDate: "2026-01-08",
        supplier: "SUP-001",
        store: "SHP-001",
        status: "received",
        items: [
            { productId: 1, sku: "SKU-001", name: "Sữa tươi Vinamilk 1L", quantity: 100, cost: 28000, receivedQty: 100, actualCost: 28000 },
        ],
        totalAmount: 2800000,
        note: "Đơn hàng định kỳ",
    },
    {
        id: "PO-002",
        createdDate: "2026-01-10",
        supplier: "SUP-002",
        store: "SHP-002",
        status: "ordered",
        items: [
            { productId: 2, sku: "SKU-002", name: "Coca-Cola 330ml", quantity: 200, cost: 9000, receivedQty: 0, actualCost: 0 },
            { productId: 3, sku: "SKU-003", name: "Bánh Oreo", quantity: 50, cost: 18000, receivedQty: 0, actualCost: 0 },
        ],
        totalAmount: 2700000,
        note: "",
    },
    {
        id: "PO-003",
        createdDate: "2026-01-11",
        supplier: "SUP-003",
        store: "SHP-001",
        status: "draft",
        items: [
            { productId: 4, sku: "SKU-004", name: "Mì gói Hảo Hảo", quantity: 500, cost: 4000, receivedQty: 0, actualCost: 0 },
        ],
        totalAmount: 2000000,
        note: "Đơn dự kiến tháng 1",
    },
];

const getStatusBadge = (status) => {
    switch (status) {
        case "draft":
            return <Badge className="bg-gray-100 text-gray-700">Nháp</Badge>;
        case "ordered":
            return <Badge className="bg-blue-100 text-blue-700">Đã đặt hàng</Badge>;
        case "received":
            return <Badge className="bg-green-100 text-green-700">Đã nhập kho</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
};

const PurchaseOrders = () => {
    const [pos, setPos] = useState(initialPOs);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [selectedPO, setSelectedPO] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Form state for creating PO
    const [formData, setFormData] = useState({
        supplier: "",
        store: "",
        note: "",
        items: [{ productId: "", quantity: "", cost: "" }],
    });

    // Receive form state
    const [receiveData, setReceiveData] = useState([]);

    // Filter POs
    const filteredPOs = pos.filter((po) => {
        const matchSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            suppliers.find(s => s.id === po.supplier)?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = !filterStatus || po.status === filterStatus;
        return matchSearch && matchStatus;
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            supplier: "",
            store: "",
            note: "",
            items: [{ productId: "", quantity: "", cost: "" }],
        });
        setFormErrors({});
    };

    // Add item row
    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { productId: "", quantity: "", cost: "" }],
        });
    };

    // Remove item row
    const removeItem = (index) => {
        if (formData.items.length === 1) return;
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        });
    };

    // Update item field
    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-fill cost when product is selected
        if (field === "productId") {
            const product = products.find(p => p.id.toString() === value);
            if (product) {
                newItems[index].cost = product.defaultCost.toString();
            }
        }

        setFormData({ ...formData, items: newItems });
    };

    // Calculate total amount
    const calculateTotal = (items) => {
        return items.reduce((sum, item) => {
            const qty = parseInt(item.quantity) || 0;
            const cost = parseFloat(item.cost) || 0;
            return sum + (qty * cost);
        }, 0);
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!formData.supplier) errors.supplier = "Vui lòng chọn nhà cung cấp";
        if (!formData.store) errors.store = "Vui lòng chọn cửa hàng";

        const itemErrors = [];
        formData.items.forEach((item, index) => {
            const iErrors = {};
            if (!item.productId) iErrors.productId = "Chọn sản phẩm";
            if (!item.quantity || parseInt(item.quantity) <= 0) iErrors.quantity = "Số lượng > 0";
            if (!item.cost || parseFloat(item.cost) <= 0) iErrors.cost = "Giá vốn > 0";
            if (Object.keys(iErrors).length > 0) itemErrors[index] = iErrors;
        });

        if (itemErrors.some(e => e)) errors.items = itemErrors;
        return errors;
    };

    // Handle create PO
    const handleCreatePO = (e, asDraft = true) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const newPO = {
            id: `PO-${String(pos.length + 1).padStart(3, "0")}`,
            createdDate: new Date().toISOString().split("T")[0],
            supplier: formData.supplier,
            store: formData.store,
            status: asDraft ? "draft" : "ordered",
            items: formData.items.map(item => {
                const product = products.find(p => p.id.toString() === item.productId);
                return {
                    productId: parseInt(item.productId),
                    sku: product?.sku,
                    name: product?.name,
                    quantity: parseInt(item.quantity),
                    cost: parseFloat(item.cost),
                    receivedQty: 0,
                    actualCost: 0,
                };
            }),
            totalAmount: calculateTotal(formData.items),
            note: formData.note,
        };

        setPos([newPO, ...pos]);
        setIsCreateModalOpen(false);
        resetForm();
    };

    // Open detail modal
    const handleViewDetail = (po) => {
        setSelectedPO(po);
        setIsDetailModalOpen(true);
    };

    // Open receive modal
    const handleOpenReceive = (po) => {
        setSelectedPO(po);
        setReceiveData(po.items.map(item => ({
            ...item,
            receivedQty: item.quantity.toString(),
            actualCost: item.cost.toString(),
        })));
        setIsReceiveModalOpen(true);
    };

    // Handle receive goods
    const handleReceiveGoods = (e) => {
        e.preventDefault();

        const updatedPO = {
            ...selectedPO,
            status: "received",
            items: receiveData.map(item => ({
                ...item,
                receivedQty: parseInt(item.receivedQty),
                actualCost: parseFloat(item.actualCost),
            })),
        };

        setPos(pos.map(p => p.id === selectedPO.id ? updatedPO : p));
        setIsReceiveModalOpen(false);
        setSelectedPO(null);
    };

    // Update PO status
    const handleSendOrder = (po) => {
        setPos(pos.map(p => p.id === po.id ? { ...p, status: "ordered" } : p));
    };

    // Delete draft PO
    const handleDeletePO = (po) => {
        if (po.status !== "draft") return;
        if (window.confirm(`Xóa đơn hàng ${po.id}?`)) {
            setPos(pos.filter(p => p.id !== po.id));
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    };

    // Get names
    const getSupplierName = (id) => suppliers.find(s => s.id === id)?.name || id;
    const getStoreName = (id) => stores.find(s => s.id === id)?.name || id;

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex justify-between items-start">
                <div>
                    <Header>Quản lý Đơn nhập hàng</Header>
                    <span className="italic text-gray-500">Tạo và quản lý đơn đặt hàng từ nhà cung cấp</span>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <FaPlus className="mr-2" /> Tạo đơn nhập
                </Button>
            </header>

            {/* Toolbar */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Tìm theo mã đơn, nhà cung cấp..."
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
                    <option value="draft">Nháp</option>
                    <option value="ordered">Đã đặt hàng</option>
                    <option value="received">Đã nhập kho</option>
                </select>
            </div>

            {/* PO Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-600">Mã đơn</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Ngày tạo</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Nhà cung cấp</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Cửa hàng nhận</th>
                                    <th className="text-right p-4 font-medium text-gray-600">Tổng tiền</th>
                                    <th className="text-center p-4 font-medium text-gray-600">Trạng thái</th>
                                    <th className="text-center p-4 font-medium text-gray-600">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredPOs.map((po) => (
                                    <tr key={po.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono font-medium text-blue-600">{po.id}</td>
                                        <td className="p-4 text-gray-600">{po.createdDate}</td>
                                        <td className="p-4">{getSupplierName(po.supplier)}</td>
                                        <td className="p-4 text-gray-600">{getStoreName(po.store)}</td>
                                        <td className="p-4 text-right font-medium">{formatCurrency(po.totalAmount)}</td>
                                        <td className="p-4 text-center">{getStatusBadge(po.status)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(po)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye />
                                                </button>

                                                {po.status === "draft" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleSendOrder(po)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                            title="Gửi đơn hàng"
                                                        >
                                                            <FaTruck />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePO(po)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                            title="Xóa"
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </>
                                                )}

                                                {po.status === "ordered" && (
                                                    <button
                                                        onClick={() => handleOpenReceive(po)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                        title="Nhập kho"
                                                    >
                                                        <FaBoxOpen />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPOs.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">
                                            Chưa có đơn nhập hàng
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Create PO Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Tạo đơn nhập hàng">
                <form onSubmit={(e) => handleCreatePO(e, false)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Supplier & Store */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nhà cung cấp *</label>
                            <select
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                className={`w-full rounded-md border px-3 py-2 text-sm ${formErrors.supplier ? "border-red-500" : ""}`}
                            >
                                <option value="">Chọn nhà cung cấp</option>
                                {suppliers.map((sup) => (
                                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Cửa hàng nhận *</label>
                            <select
                                value={formData.store}
                                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                                className={`w-full rounded-md border px-3 py-2 text-sm ${formErrors.store ? "border-red-500" : ""}`}
                            >
                                <option value="">Chọn cửa hàng</option>
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>{store.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Sản phẩm</h4>
                            <Button type="button" size="sm" onClick={addItem}>
                                <FaPlus className="mr-1" /> Thêm dòng
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {formData.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-5">
                                        <label className="block text-xs text-gray-500 mb-1">Sản phẩm</label>
                                        <select
                                            value={item.productId}
                                            onChange={(e) => updateItem(index, "productId", e.target.value)}
                                            className="w-full rounded-md border px-2 py-1.5 text-sm"
                                        >
                                            <option value="">Chọn sản phẩm</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs text-gray-500 mb-1">Số lượng</label>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                            className="w-full rounded-md border px-2 py-1.5 text-sm"
                                            placeholder="0"
                                            min="1"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-xs text-gray-500 mb-1">Giá vốn</label>
                                        <input
                                            type="number"
                                            value={item.cost}
                                            onChange={(e) => updateItem(index, "cost", e.target.value)}
                                            className="w-full rounded-md border px-2 py-1.5 text-sm"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        {formData.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-4 p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                            <span className="font-medium">Tổng tiền:</span>
                            <span className="text-xl font-bold text-blue-600">
                                {formatCurrency(calculateTotal(formData.items))}
                            </span>
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
                            placeholder="Ghi chú..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 flex justify-end gap-2 border-t">
                        <Button type="button" variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>
                            Hủy bỏ
                        </Button>
                        <Button type="button" variant="ghost" onClick={(e) => handleCreatePO(e, true)}>
                            Lưu nháp
                        </Button>
                        <Button type="submit">
                            <FaTruck className="mr-2" /> Đặt hàng
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title={`Chi tiết ${selectedPO?.id}`}>
                {selectedPO && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Nhà cung cấp</p>
                                <p className="font-medium">{getSupplierName(selectedPO.supplier)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Cửa hàng nhận</p>
                                <p className="font-medium">{getStoreName(selectedPO.store)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Ngày tạo</p>
                                <p className="font-medium">{selectedPO.createdDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Trạng thái</p>
                                {getStatusBadge(selectedPO.status)}
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-medium mb-2">Danh sách sản phẩm</h4>
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-2">SKU</th>
                                        <th className="text-left p-2">Tên SP</th>
                                        <th className="text-right p-2">SL đặt</th>
                                        <th className="text-right p-2">Giá vốn</th>
                                        {selectedPO.status === "received" && (
                                            <>
                                                <th className="text-right p-2">SL nhận</th>
                                                <th className="text-right p-2">Giá thực</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {selectedPO.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="p-2 font-mono">{item.sku}</td>
                                            <td className="p-2">{item.name}</td>
                                            <td className="p-2 text-right">{item.quantity}</td>
                                            <td className="p-2 text-right">{formatCurrency(item.cost)}</td>
                                            {selectedPO.status === "received" && (
                                                <>
                                                    <td className="p-2 text-right text-green-600">{item.receivedQty}</td>
                                                    <td className="p-2 text-right">{formatCurrency(item.actualCost)}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                            <span className="font-medium">Tổng tiền:</span>
                            <span className="text-xl font-bold text-blue-600">{formatCurrency(selectedPO.totalAmount)}</span>
                        </div>

                        {selectedPO.note && (
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-600">Ghi chú: {selectedPO.note}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Receive Modal */}
            <Modal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)} title={`Nhập kho - ${selectedPO?.id}`}>
                {selectedPO && (
                    <form onSubmit={handleReceiveGoods} className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                            <FaBoxOpen className="text-blue-600" />
                            <p className="text-sm text-blue-800">Nhập số lượng và giá thực tế nhận được</p>
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-2">Sản phẩm</th>
                                    <th className="text-right p-2">SL đặt</th>
                                    <th className="text-right p-2">SL nhận</th>
                                    <th className="text-right p-2">Giá thực tế</th>
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
                                                className="w-full rounded-md border px-2 py-1 text-sm text-right"
                                                min="0"
                                                max={item.quantity}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                value={item.actualCost}
                                                onChange={(e) => {
                                                    const newData = [...receiveData];
                                                    newData[index].actualCost = e.target.value;
                                                    setReceiveData(newData);
                                                }}
                                                className="w-full rounded-md border px-2 py-1 text-sm text-right"
                                                min="0"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pt-4 flex justify-end gap-2 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsReceiveModalOpen(false)}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                <FaCheck className="mr-2" /> Hoàn tất nhập kho
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default PurchaseOrders;
