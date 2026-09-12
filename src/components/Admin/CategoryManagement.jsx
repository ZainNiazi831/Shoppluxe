import React, { useState, useEffect } from 'react';
import { CategoryService } from '../../services/api';
import { Plus, Edit3, Trash2, X, Save, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        status: 'active'
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const result = await CategoryService.getAll();
            if (result.success) {
                setCategories(result.categories || []);
            }
        } catch (error) {
            toast.error('Failed to load categories');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', image: '', status: 'active' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        let result;
        if (editingId) {
            result = await CategoryService.update(editingId, formData);
        } else {
            result = await CategoryService.create(formData);
        }

        if (result.success) {
            toast.success(editingId ? 'Category updated!' : 'Category added!');
            loadCategories();
            resetForm();
        } else {
            toast.error(result.error);
        }

        setSaving(false);
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name || '',
            description: category.description || '',
            image: category.image || '',
            status: category.status || 'active'
        });
        setEditingId(category._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;

        const result = await CategoryService.delete(id);
        if (result.success) {
            toast.success('Category deleted');
            loadCategories();
        } else {
            toast.error(result.error);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                    📂 Category Management
                </h3>

                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: showForm ? 'var(--color-sky-blue)' : 'var(--color-teal)',
                        color: showForm ? 'var(--color-navy)' : 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancel' : 'Add Category'}
                </button>
            </div>

            {showForm && (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-xl)',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                        {editingId ? '✏️ Edit Category' : '➕ Add New Category'}
                    </h4>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                                Category Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Electronics"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Optional description"
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                                Image URL
                            </label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                }}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '12px 28px',
                                backgroundColor: saving ? 'var(--color-border)' : 'var(--color-teal)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : editingId ? 'Update Category' : 'Save Category'}
                        </button>
                    </form>
                </div>
            )}

            {categories.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-xl)',
                    padding: '60px 40px',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                }}>
                    <FolderOpen size={64} color="var(--color-text-light)" style={{ marginBottom: '20px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                        No Categories Yet
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-light)', marginBottom: '20px' }}>
                        Add your first category to organize products
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '12px 28px',
                            backgroundColor: 'var(--color-teal)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                        }}
                    >
                        Add Category
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                    {categories.map((category) => (
                        <div key={category._id} style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-lg)',
                            padding: '20px',
                            boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            flexWrap: 'wrap',
                        }}>
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: 'var(--radius-md)',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--color-sky-blue)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <FolderOpen size={28} color="var(--color-teal)" />
                                </div>
                            )}

                            <div style={{ flex: 1, minWidth: '150px' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                                    {category.name}
                                </h4>
                                {category.description && (
                                    <p style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                                        {category.description}
                                    </p>
                                )}
                                <p style={{ fontSize: '12px', color: 'var(--color-teal)', marginTop: '4px', fontWeight: '600' }}>
                                    {category.productCount || 0} products
                                </p>
                            </div>

                            <span style={{
                                padding: '4px 12px',
                                backgroundColor: category.status === 'active' ? '#E8F5E9' : '#FFEBEE',
                                color: category.status === 'active' ? '#2E7D32' : '#C62828',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '12px',
                                fontWeight: '600',
                            }}>
                                {category.status}
                            </span>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleEdit(category)}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: 'var(--color-sky-blue)',
                                        color: 'var(--color-navy)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-full)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                    }}
                                >
                                    <Edit3 size={14} />
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(category._id)}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#FFEBEE',
                                        color: '#C62828',
                                        border: 'none',
                                        borderRadius: 'var(--radius-full)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                    }}
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;