import React, { useState, useEffect } from 'react';
import { ProductService } from '../../services/api';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const result = await ProductService.getAll();
        if (result.success) {
            setProducts(result.products || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"?`)) return;
        toast.success('Product deleted (demo)');
        setProducts(products.filter(p => p._id !== id));
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px'
            }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#2F4156', margin: 0 }}>
                        Products Management
                    </h1>
                    <p style={{ color: '#567C8D', marginTop: '4px', fontSize: '14px' }}>
                        Total: {products.length} products
                    </p>
                </div>
                <button style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px', borderRadius: '50px',
                    background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                    color: 'white', border: 'none', cursor: 'pointer',
                    fontWeight: 600, fontSize: '14px'
                }}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'white', borderRadius: '50px',
                padding: '10px 20px', marginBottom: '20px',
                boxShadow: '0 2px 12px rgba(47, 65, 86, 0.05)'
            }}>
                <Search size={18} color="#8A9BAB" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px' }}
                />
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: '#8A9BAB' }}>Loading...</p>
            ) : filtered.length === 0 ? (
                <div style={{
                    background: 'white', borderRadius: '16px', padding: '60px',
                    textAlign: 'center', color: '#8A9BAB'
                }}>
                    <p>📦 Koi product nahi mila</p>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(47, 65, 86, 0.05)' }}>
                    {filtered.map((p, i) => (
                        <div key={p._id || i} style={{
                            display: 'flex', alignItems: 'center', gap: '16px',
                            padding: '16px 20px',
                            borderBottom: i < filtered.length - 1 ? '1px solid #F0EDE7' : 'none'
                        }}>
                            <img
                                src={p.images?.[0] || p.image || 'https://via.placeholder.com/60'}
                                alt={p.name}
                                style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, color: '#2F4156', margin: 0 }}>{p.name}</p>
                                <p style={{ fontSize: '13px', color: '#8A9BAB', margin: 0 }}>
                                    {p.category} • ${p.price}
                                </p>
                            </div>
                            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
                                <Edit2 size={18} color="#6366F1" />
                            </button>
                            <button
                                onClick={() => handleDelete(p._id, p.name)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}
                            >
                                <Trash2 size={18} color="#EF4444" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductManagement;