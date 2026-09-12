import React, { useState, useEffect } from 'react';
import { ReviewService } from '../../services/api';
import {
    Star,
    Search,
    CheckCircle,
    EyeOff,
    Trash2,
    MessageSquare,
    Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRating, setFilterRating] = useState('all');

    useEffect(() => {
        loadReviews();
    }, []);

    useEffect(() => {
        filterReviews();
    }, [reviews, searchTerm, filterStatus, filterRating]);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const result = await ReviewService.getAllReviews();
            if (result.success) {
                setReviews(result.reviews || []);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to load reviews');
        }
        setLoading(false);
    };

    const filterReviews = () => {
        let filtered = [...reviews];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.productName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(r => r.status === filterStatus);
        }

        // Rating filter
        if (filterRating !== 'all') {
            filtered = filtered.filter(r => r.rating === Number(filterRating));
        }

        setFilteredReviews(filtered);
    };

    const handleStatusChange = async (reviewId, newStatus) => {
        const result = await ReviewService.updateReviewStatus(reviewId, newStatus);
        if (result.success) {
            toast.success(`Review ${newStatus}`);
            setReviews(prev =>
                prev.map(r => r._id === reviewId ? { ...r, status: newStatus } : r)
            );
        } else {
            toast.error(result.error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        const result = await ReviewService.deleteReviewAdmin(reviewId);
        if (result.success) {
            toast.success('Review deleted');
            setReviews(prev => prev.filter(r => r._id !== reviewId));
        } else {
            toast.error(result.error);
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'approved') return { bg: '#E8F5E9', color: '#2E7D32' };
        if (status === 'pending') return { bg: '#FFF3E0', color: '#F57C00' };
        if (status === 'hidden') return { bg: '#F0F2F5', color: '#666' };
        return { bg: '#F0F2F5', color: '#666' };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const totalReviews = reviews.length;
    const approvedCount = reviews.filter(r => r.status === 'approved').length;
    const pendingCount = reviews.filter(r => r.status === 'pending').length;
    const hiddenCount = reviews.filter(r => r.status === 'hidden').length;

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Loading reviews...</p>
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
                    ⭐ Review Management
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                    Manage customer reviews — approve, hide, or delete
                </p>
            </div>

            {/* STATS CARDS */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
            }}>
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
                        <MessageSquare size={22} />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Total</p>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{totalReviews}</p>
                    </div>
                </div>

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
                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Approved</p>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{approvedCount}</p>
                    </div>
                </div>

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
                        <MessageSquare size={22} />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Pending</p>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{pendingCount}</p>
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <div style={{ backgroundColor: '#F0F2F5', padding: '10px', borderRadius: '10px', color: '#666' }}>
                        <EyeOff size={22} />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Hidden</p>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{hiddenCount}</p>
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
                        placeholder="Search by customer, comment, or product..."
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
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="hidden">Hidden</option>
                </select>

                <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
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
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>

            {/* REVIEWS LIST */}
            {filteredReviews.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '60px 40px',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                }}>
                    <MessageSquare size={48} color="var(--color-text-light)" style={{ marginBottom: '16px' }} />
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                        No Reviews Found
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                        Try adjusting your search or filters
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {filteredReviews.map((review) => {
                        const statusStyle = getStatusStyle(review.status);

                        return (
                            <div
                                key={review._id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '20px',
                                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                {/* Header Row */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    flexWrap: 'wrap',
                                    marginBottom: '12px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            background: 'var(--color-teal)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            flexShrink: 0,
                                        }}>
                                            {review.userName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p style={{
                                                fontSize: '15px',
                                                fontWeight: '700',
                                                color: 'var(--color-text-primary)',
                                                marginBottom: '2px',
                                            }}>
                                                {review.userName || 'Unknown User'}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', gap: '1px' }}>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={14}
                                                            fill={star <= review.rating ? '#F5A623' : 'none'}
                                                            color="#F5A623"
                                                        />
                                                    ))}
                                                </div>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                                    {formatDate(review.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <span style={{
                                        padding: '4px 12px',
                                        backgroundColor: statusStyle.bg,
                                        color: statusStyle.color,
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}>
                                        {review.status}
                                    </span>
                                </div>

                                {/* Product Info */}
                                <div style={{
                                    padding: '10px 14px',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}>
                                    <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Product:</span>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                                        {review.productName || 'Product'}
                                    </span>
                                </div>

                                {/* Comment */}
                                <p style={{
                                    fontSize: '14px',
                                    color: 'var(--color-text-secondary)',
                                    lineHeight: '1.6',
                                    marginBottom: '16px',
                                    padding: '12px',
                                    backgroundColor: '#F8FAFC',
                                    borderRadius: 'var(--radius-md)',
                                    fontStyle: 'italic',
                                }}>
                                    "{review.comment}"
                                </p>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {review.status !== 'approved' && (
                                        <button
                                            onClick={() => handleStatusChange(review._id, 'approved')}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#E8F5E9',
                                                color: '#2E7D32',
                                                border: 'none',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}
                                        >
                                            <CheckCircle size={14} />
                                            Approve
                                        </button>
                                    )}

                                    {review.status !== 'hidden' && (
                                        <button
                                            onClick={() => handleStatusChange(review._id, 'hidden')}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#F0F2F5',
                                                color: '#666',
                                                border: 'none',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}
                                        >
                                            <EyeOff size={14} />
                                            Hide
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#FFEBEE',
                                            color: '#C62828',
                                            border: 'none',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                        }}
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ReviewManagement;