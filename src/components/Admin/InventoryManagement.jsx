import React, { useState, useEffect } from 'react';
import { ProductService } from '../../services/api';
import axios from 'axios';
import {
    Package,
    Search,
    AlertTriangle,
    XCircle,
    CheckCircle,
    Save,
    Pencil,
    X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [editingStock, setEditingStock] = useState('');
    const [saving, setSaving] = useState(false);

    // ✅ Configured threshold for low stock
    const LOW_STOCK_THRESHOLD = 10;

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, filterStatus]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const result = await ProductService.getAll();
            if (result.success) {
                setProducts(result.products || []);
            }
        } catch (error) {
            toast.error('Failed to load products');
        }
        setLoading(false);
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus === 'low-stock') {
            filtered = filtered.filter(p =>
                p.stockQuantity > 0 && p.stockQuantity <= LOW_STOCK_THRESHOLD
            );
        } else if (filterStatus === 'out-of-stock') {
            filtered = filtered.filter(p => p.stockQuantity <= 0);
        } else if (filterStatus === 'in-stock') {
            filtered = filtered.filter(p => p.stockQuantity > LOW_STOCK_THRESHOLD);
        }

        setFilteredProducts(filtered);
    };

    // ✅ Get stock status based on threshold
    const getStockStatus = (quantity) => {
        if (quantity <= 0) {
            return { label: 'Out of Stock', color: '#C62828', bg: '#FFEBEE', icon: <XCircle size={14} /> };
        }
        if (quantity <= LOW_STOCK_THRESHOLD) {
            return { label: 'Low Stock', color: '#F57C00', bg: '#FFF3E0', icon: <AlertTriangle size={14} /> };
        }
        return { label: 'In Stock', color: '#2E7D32', bg: '#E8F5E9', icon: <CheckCircle size={14} /> };
    };

    const handleEdit = (product) => {
        setEditingId(product._id);
        setEditingStock(product.stockQuantity || 0);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingStock('');
    };

    const handleUpdateStock = async (productId) => {
        const newStock = parseInt(editingStock);

        if (isNaN(newStock) || newStock < 0) {
            toast.error('Please enter a valid stock quantity');
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `import.meta.env.VITE_API_URL/api/products/${productId}`,
                { stockQuantity: newStock },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setProducts(prev =>
                prev.map(p =>
                    p._id === productId ? { ...p, stockQuantity: newStock } : p
                )
            );

            toast.success('Stock updated successfully!');
            setEditingId(null);
            setEditingStock('');
        } catch (error) {
            toast.error('Failed to update stock');
        }

        setSaving(false);
    };

    // ✅ Stats
    const totalProducts = products.length;
    const inStockCount = products.filter(p => p.stockQuantity > LOW_STOCK_THRESHOLD).length;
    const lowStockCount = products.filter(
        p => p.stockQuantity > 0 && p.stockQuantity <= LOW_STOCK_THRESHOLD
    ).length;
    const outOfStockCount = products.filter(p => p.stockQuantity <= 0).length;

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Loading inventory...</p>
            </div>
        );
    }

    return (
        <div>
            {/* HEADER */}
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px',
                }}>
                    📦 Inventory Management
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                    Low stock threshold: {LOW_STOCK_THRESHOLD} units
                </p>
            </div>

            {/* STATS CARDS */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
            }}>
                {/* Total */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <div style={{ backgroundColor: '#E3F2FD', padding: '10px', borderRadius: '10px', color: '#1565C0' }}>
                        <Package size={22} />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Total Products</p>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{totalProducts}</p>
                    </div>
                </div>

                {/* In Stock */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <div style={{ backgroundColor: '#E8F5E9', padding: '10px', borderRadius: '10px', color: '#2E7D32' }}>
                        <CheckCircle size={22} />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>In Stock</p>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{inStockCount}</p>
                    </div>
                </div>

                {/* Low Stock */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <div style={{ backgroundColor: '#FFF3E0', padding: '10px', borderRadius: '10px', color: '#F57C00' }}>
                        <AlertTriangle size={22} />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Low Stock</p>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{lowStockCount}</p>
                    </div>
                </div>

                {/* Out of Stock */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <div style={{ backgroundColor: '#FFEBEE', padding: '10px', borderRadius: '10px', color: '#C62828' }}>
                        <XCircle size={22} />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Out of Stock</p>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{outOfStockCount}</p>
                    </div>
                </div>
            </div>

            {/* SEARCH & FILTER */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap',
            }}>
                {/* Search */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-full)',
                    padding: '10px 18px',
                    gap: '8px',
                    flex: 1,
                    minWidth: '200px',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 2px 8px rgba(47, 65, 86, 0.04)',
                }}>
                    <Search size={18} color="var(--color-teal)" />
                    <input
                        type="text"
                        placeholder="Search by product name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            outline: 'none',
                            fontSize: '14px',
                            width: '100%',
                            color: 'var(--color-text-primary)',
                        }}
                    />
                </div>

                {/* Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                        padding: '10px 18px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(47, 65, 86, 0.04)',
                    }}
                >
                    <option value="all">All Products</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                </select>
            </div>

            {/* INVENTORY TABLE */}
            {filteredProducts.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '60px 40px',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                }}>
                    <Package size={48} color="var(--color-text-light)" style={{ marginBottom: '16px' }} />
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                        No Products Found
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                        Try adjusting your search or filter
                    </p>
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F5EFEB' }}>
                                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                        Product
                                    </th>
                                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                        SKU
                                    </th>
                                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                        Stock
                                    </th>
                                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                        Status
                                    </th>
                                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => {
                                    const status = getStockStatus(product.stockQuantity || 0);
                                    const isEditing = editingId === product._id;

                                    return (
                                        <tr key={product._id} style={{ borderTop: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <img
                                                        src={product.images?.[0] || product.image || 'https://via.placeholder.com/40'}
                                                        alt={product.name}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px',
                                                        }}
                                                    />
                                                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                                                        {product.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--color-text-light)' }}>
                                                {product.sku || 'N/A'}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editingStock}
                                                        onChange={(e) => setEditingStock(e.target.value)}
                                                        min="0"
                                                        autoFocus
                                                        style={{
                                                            width: '80px',
                                                            padding: '6px 10px',
                                                            border: '2px solid var(--color-teal)',
                                                            borderRadius: 'var(--radius-md)',
                                                            fontSize: '14px',
                                                            outline: 'none',
                                                        }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                                        {product.stockQuantity || 0}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '4px 12px',
                                                    backgroundColor: status.bg,
                                                    color: status.color,
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                }}>
                                                    {status.icon}
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                {isEditing ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleUpdateStock(product._id)}
                                                            disabled={saving}
                                                            style={{
                                                                padding: '6px 12px',
                                                                backgroundColor: 'var(--color-teal)',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: 'var(--radius-full)',
                                                                cursor: saving ? 'not-allowed' : 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                            }}
                                                        >
                                                            <Save size={14} />
                                                            {saving ? 'Saving...' : 'Save'}
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            style={{
                                                                padding: '6px 12px',
                                                                backgroundColor: 'var(--color-bg-primary)',
                                                                color: 'var(--color-text-primary)',
                                                                border: '1px solid var(--color-border)',
                                                                borderRadius: 'var(--radius-full)',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                            }}
                                                        >
                                                            <X size={14} />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        style={{
                                                            padding: '6px 14px',
                                                            backgroundColor: 'var(--color-sky-blue)',
                                                            color: 'var(--color-navy)',
                                                            border: 'none',
                                                            borderRadius: 'var(--radius-full)',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        <Pencil size={14} />
                                                        Update
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;