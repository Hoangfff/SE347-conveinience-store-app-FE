import React, { useState } from "react";
import { Header } from "../../components/ui/header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { SearchBar } from "../../components/ui/searchbar";
import Modal from "../../components/ui/modal";
import { FaPlus, FaHistory, FaWarehouse, FaArrowUp, FaArrowDown } from "react-icons/fa";

// Dummy stores
const stores = [
    { id: "SHP-001", name: "Cửa hàng Q1" },
    { id: "SHP-002", name: "Cửa hàng Q7" },
    { id: "SHP-003", name: "Cửa hàng Q3" },
];

// Dummy products with variants
const products = [
    {
        id: 1,
        sku: "SKU-001",
        name: "Sữa tươi Vinamilk",
        variants: [
            { id: 1, code: "SKU-001-1L", name: "1 Lít", stock: { "SHP-001": 50, "SHP-002": 30, "SHP-003": 20 } },
            { id: 2, code: "SKU-001-500ML", name: "500ml", stock: { "SHP-001": 40, "SHP-002": 25, "SHP-003": 15 } },
        ],
    },
    {
        id: 2,
        sku: "SKU-002",
        name: "Coca-Cola",
        variants: [
            { id: 1, code: "SKU-002-330ML", name: "330ml", stock: { "SHP-001": 100, "SHP-002": 80, "SHP-003": 60 } },
            { id: 2, code: "SKU-002-1.5L", name: "1.5L", stock: { "SHP-001": 25, "SHP-002": 20, "SHP-003": 15 } },
        ],
    },
    {
        id: 3,
        sku: "SKU-003",
        name: "Bánh mì",
        variants: [
            { id: 1, code: "SKU-003-REG", name: "Thường", stock: { "SHP-001": 30, "SHP-002": 40, "SHP-003": 25 } },
        ],
    },
];

// Adjustment reasons
const adjustmentReasons = [
    "Kiểm kê định kỳ",
    "Hàng hư hỏng",
    "Hàng hết hạn",
    "Sai lệch tồn kho",
    "Nhập thêm hàng",
    "Khác",
];

// Initial adjustment history
const initialHistory = [
    {
        id: 1,
        date: "2026-01-10T14:30:00",
        store: "SHP-001",
        product: "Sữa tươi Vinamilk - 1 Lít",
        variant: "SKU-001-1L",
        quantity: -5,
        reason: "Hàng hư hỏng",
        user: "Nguyễn Văn A",
        note: "Hàng bị móp lon",
    },
    {
        id: 2,
        date: "2026-01-09T10:15:00",
        store: "SHP-002",
        product: "Coca-Cola - 330ml",
        variant: "SKU-002-330ML",
        quantity: 20,
        reason: "Kiểm kê định kỳ",
        user: "Trần Thị B",
        note: "Phát hiện thiếu khi kiểm kê",
    },
];

const InventoryAdjustment = () => {
    const [history, setHistory] = useState(initialHistory);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStore, setFilterStore] = useState("");
    const [formErrors, setFormErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        store: "",
        product: "",
        variant: "",
        adjustmentType: "decrease", // increase or decrease
        quantity: "",
        reason: "",
        customReason: "",
        note: "",
    });

    // Get available variants for selected product
    const getVariants = () => {
        const product = products.find((p) => p.id.toString() === formData.product);
        return product?.variants || [];
    };

    // Get current stock for selected store/variant
    const getCurrentStock = () => {
        if (!formData.store || !formData.product || !formData.variant) return null;
        const product = products.find((p) => p.id.toString() === formData.product);
        const variant = product?.variants.find((v) => v.id.toString() === formData.variant);
        return variant?.stock[formData.store] || 0;
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.store) errors.store = "Vui lòng chọn cửa hàng";
        if (!formData.product) errors.product = "Vui lòng chọn sản phẩm";
        if (!formData.variant) errors.variant = "Vui lòng chọn biến thể";
        if (!formData.quantity || parseInt(formData.quantity) <= 0) {
            errors.quantity = "Số lượng phải > 0";
        }
        if (!formData.reason) errors.reason = "Vui lòng chọn lý do";
        if (formData.reason === "Khác" && !formData.customReason.trim()) {
            errors.customReason = "Vui lòng nhập lý do cụ thể";
        }

        // Check if decrease would make stock negative
        if (formData.adjustmentType === "decrease") {
            const currentStock = getCurrentStock();
            if (currentStock !== null && parseInt(formData.quantity) > currentStock) {
                errors.quantity = `Không thể giảm quá tồn kho hiện tại (${currentStock})`;
            }
        }

        return errors;
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            store: "",
            product: "",
            variant: "",
            adjustmentType: "decrease",
            quantity: "",
            reason: "",
            customReason: "",
            note: "",
        });
        setFormErrors({});
    };

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const product = products.find((p) => p.id.toString() === formData.product);
        const variant = product?.variants.find((v) => v.id.toString() === formData.variant);
        const quantity = formData.adjustmentType === "increase"
            ? parseInt(formData.quantity)
            : -parseInt(formData.quantity);

        const newAdjustment = {
            id: history.length + 1,
            date: new Date().toISOString(),
            store: formData.store,
            product: `${product?.name} - ${variant?.name}`,
            variant: variant?.code,
            quantity: quantity,
            reason: formData.reason === "Khác" ? formData.customReason : formData.reason,
            user: "Admin User", // Would come from auth context
            note: formData.note,
        };

        setHistory([newAdjustment, ...history]);
        setIsModalOpen(false);
        resetForm();
    };

    // Filter history
    const filteredHistory = history.filter((item) => {
        const matchSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.variant.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStore = !filterStore || item.store === filterStore;
        return matchSearch && matchStore;
    });

    // Format date
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Get store name
    const getStoreName = (storeId) => {
        return stores.find((s) => s.id === storeId)?.name || storeId;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex justify-between items-start">
                <div>
                    <Header>Điều chỉnh Tồn kho</Header>
                    <span className="italic text-gray-500">Kiểm kê và cân bằng kho hàng</span>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <FaPlus className="mr-2" /> Điều chỉnh mới
                </Button>
            </header>

            {/* Toolbar */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Tìm theo sản phẩm, mã biến thể..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={filterStore}
                    onChange={(e) => setFilterStore(e.target.value)}
                    className="rounded-md border px-3 py-2 text-sm"
                >
                    <option value="">Tất cả cửa hàng</option>
                    {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                            {store.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* History Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="flex items-center gap-2 p-4 border-b bg-gray-50">
                        <FaHistory className="text-gray-500" />
                        <h3 className="font-medium">Lịch sử điều chỉnh</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-600">Thời gian</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Cửa hàng</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Sản phẩm</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Mã biến thể</th>
                                    <th className="text-center p-4 font-medium text-gray-600">Số lượng</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Lý do</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Người thực hiện</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-gray-600 text-sm">{formatDate(item.date)}</td>
                                        <td className="p-4 text-gray-600">{getStoreName(item.store)}</td>
                                        <td className="p-4 font-medium">{item.product}</td>
                                        <td className="p-4 font-mono text-sm text-gray-600">{item.variant}</td>
                                        <td className="p-4 text-center">
                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${item.quantity > 0
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {item.quantity > 0 ? <FaArrowUp /> : <FaArrowDown />}
                                                {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">{item.reason}</td>
                                        <td className="p-4 text-gray-600">{item.user}</td>
                                    </tr>
                                ))}
                                {filteredHistory.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">
                                            Chưa có lịch sử điều chỉnh
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Adjustment Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Điều chỉnh tồn kho">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Info Banner */}
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <FaWarehouse className="text-blue-600" />
                        <p className="text-sm text-blue-800">
                            Chức năng này dành cho Store Manager / Admin
                        </p>
                    </div>

                    {/* Store */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Cửa hàng *</label>
                        <select
                            value={formData.store}
                            onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                            className={`w-full rounded-md border px-3 py-2 text-sm ${formErrors.store ? "border-red-500" : ""}`}
                        >
                            <option value="">Chọn cửa hàng</option>
                            {stores.map((store) => (
                                <option key={store.id} value={store.id}>
                                    {store.name}
                                </option>
                            ))}
                        </select>
                        {formErrors.store && <p className="text-red-500 text-xs mt-1">{formErrors.store}</p>}
                    </div>

                    {/* Product */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Sản phẩm *</label>
                        <select
                            value={formData.product}
                            onChange={(e) => setFormData({ ...formData, product: e.target.value, variant: "" })}
                            className={`w-full rounded-md border px-3 py-2 text-sm ${formErrors.product ? "border-red-500" : ""}`}
                        >
                            <option value="">Chọn sản phẩm</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name} ({product.sku})
                                </option>
                            ))}
                        </select>
                        {formErrors.product && <p className="text-red-500 text-xs mt-1">{formErrors.product}</p>}
                    </div>

                    {/* Variant */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Biến thể *</label>
                        <select
                            value={formData.variant}
                            onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                            className={`w-full rounded-md border px-3 py-2 text-sm ${formErrors.variant ? "border-red-500" : ""}`}
                            disabled={!formData.product}
                        >
                            <option value="">Chọn biến thể</option>
                            {getVariants().map((variant) => (
                                <option key={variant.id} value={variant.id}>
                                    {variant.name} - {variant.code}
                                </option>
                            ))}
                        </select>
                        {formErrors.variant && <p className="text-red-500 text-xs mt-1">{formErrors.variant}</p>}
                    </div>

                    {/* Current Stock Display */}
                    {getCurrentStock() !== null && (
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <p className="text-sm">
                                Tồn kho hiện tại: <span className="font-bold text-blue-600">{getCurrentStock()}</span>
                            </p>
                        </div>
                    )}

                    {/* Adjustment Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Loại điều chỉnh *</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="adjustmentType"
                                    value="increase"
                                    checked={formData.adjustmentType === "increase"}
                                    onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value })}
                                    className="h-4 w-4"
                                />
                                <span className="text-sm text-green-700">Tăng (+)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="adjustmentType"
                                    value="decrease"
                                    checked={formData.adjustmentType === "decrease"}
                                    onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value })}
                                    className="h-4 w-4"
                                />
                                <span className="text-sm text-red-700">Giảm (-)</span>
                            </label>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Số lượng *</label>
                        <input
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className={`w-full rounded-md border px-3 py-2 text-sm ${formErrors.quantity ? "border-red-500" : ""}`}
                            placeholder="0"
                            min="1"
                        />
                        {formErrors.quantity && <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>}
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Lý do *</label>
                        <select
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className={`w-full rounded-md border px-3 py-2 text-sm ${formErrors.reason ? "border-red-500" : ""}`}
                        >
                            <option value="">Chọn lý do</option>
                            {adjustmentReasons.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                        {formErrors.reason && <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>}
                    </div>

                    {/* Custom Reason */}
                    {formData.reason === "Khác" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Lý do cụ thể *</label>
                            <input
                                type="text"
                                value={formData.customReason}
                                onChange={(e) => setFormData({ ...formData, customReason: e.target.value })}
                                className={`w-full rounded-md border px-3 py-2 text-sm ${formErrors.customReason ? "border-red-500" : ""}`}
                                placeholder="Nhập lý do..."
                            />
                            {formErrors.customReason && <p className="text-red-500 text-xs mt-1">{formErrors.customReason}</p>}
                        </div>
                    )}

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Ghi chú</label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            rows={2}
                            placeholder="Ghi chú thêm (tùy chọn)..."
                        />
                    </div>

                    {/* Submit */}
                    <div className="pt-4 flex justify-end gap-2 border-t">
                        <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit">Xác nhận điều chỉnh</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default InventoryAdjustment;
