import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ReviewService } from '../services/api';
import { Star, Send, Edit3, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Reviews = ({ productId, product, onReviewAdded }) => {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [distribution, setDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    });
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const result = await ReviewService.getProductReviews(productId);
            if (result.success) {
                setReviews(result.reviews || []);
                setAverageRating(result.averageRating || 0);
                setTotalReviews(result.totalReviews || 0);
                setDistribution(result.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.comment.trim()) {
            toast.error('Please write a review');
            return;
        }

        setSubmitting(true);

        let result;
        if (editingId) {
            result = await ReviewService.updateReview(editingId, formData);
        } else {
            // ✅ Send productName with review
            const reviewPayload = {
                productId,
                productName: product?.name || 'Product',
                rating: formData.rating,
                comment: formData.comment
            };

            console.log('Sending review:', reviewPayload); // Debug log

            result = await ReviewService.addReview(reviewPayload);
        }

        if (result.success) {
            toast.success(editingId ? 'Review updated!' : 'Review added!');
            setShowForm(false);
            setEditingId(null);
            setFormData({ rating: 5, comment: '' });
            loadReviews();
            if (onReviewAdded) onReviewAdded();
        } else {
            toast.error(result.error);
        }

        setSubmitting(false);
    };

    const handleEdit = (review) => {
        setFormData({
            rating: review.rating,
            comment: review.comment
        });
        setEditingId(review._id);
        setShowForm(true);
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Delete this review?')) return;

        const result = await ReviewService.deleteReview(reviewId);
        if (result.success) {
            toast.success('Review deleted');
            loadReviews();
        } else {
            toast.error(result.error);
        }
    };

    const userReview = reviews.find(r => r.userId === user?.id || r.userId === user?._id);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <p>Loading reviews...</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '48px' }}>
            <h2 className="section-title" style={{ marginBottom: '24px' }}>
                ⭐ Customer Reviews
            </h2>

            {/* Rating Summary */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
            }}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                    <div style={{
                        fontSize: '56px',
                        fontWeight: '800',
                        color: 'var(--color-text-primary)',
                        lineHeight: 1,
                    }}>
                        {averageRating}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '12px 0' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                size={24}
                                fill={star <= Math.round(averageRating) ? '#F5A623' : 'none'}
                                color="#F5A623"
                            />
                        ))}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                        Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                    </p>
                </div>

                <div style={{ padding: '8px 16px' }}>
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = distribution[star] || 0;
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                        return (
                            <div key={star} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '8px',
                            }}>
                                <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '24px' }}>
                                    {star} ⭐
                                </span>
                                <div style={{
                                    flex: 1,
                                    height: '10px',
                                    backgroundColor: 'var(--color-border)',
                                    borderRadius: 'var(--radius-full)',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${percentage}%`,
                                        height: '100%',
                                        backgroundColor: '#F5A623',
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'width 0.3s ease',
                                    }} />
                                </div>
                                <span style={{ fontSize: '13px', color: 'var(--color-text-light)', minWidth: '40px', textAlign: 'right' }}>
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Write Review Button */}
            {isAuthenticated && !userReview && !showForm && (
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
                        marginBottom: '24px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    ✍️ Write a Review
                </button>
            )}

            {/* Review Form */}
            {showForm && (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
                            {editingId ? '✏️ Edit Review' : '✍️ Write a Review'}
                        </h3>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setFormData({ rating: 5, comment: '' });
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                            }}
                        >
                            <X size={20} color="var(--color-text-light)" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                Your Rating *
                            </label>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                        }}
                                    >
                                        <Star
                                            size={32}
                                            fill={star <= (hoverRating || formData.rating) ? '#F5A623' : 'none'}
                                            color="#F5A623"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                Your Review *
                            </label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                placeholder="Share your experience with this product..."
                                required
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '12px 28px',
                                backgroundColor: submitting ? 'var(--color-border)' : 'var(--color-teal)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <Send size={18} />
                            {submitting ? 'Submitting...' : editingId ? 'Update Review' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '48px 24px',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '16px', color: 'var(--color-text-light)' }}>
                        No reviews yet. Be the first to review!
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {reviews.map(review => (
                        <div key={review._id} style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-lg)',
                            padding: '20px',
                            boxShadow: '0 4px 15px rgba(47, 65, 86, 0.06)',
                        }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--color-teal)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    flexShrink: 0,
                                }}>
                                    {review.userName?.charAt(0).toUpperCase()}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                                {review.userName}
                                            </h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star
                                                            key={star}
                                                            size={14}
                                                            fill={star <= review.rating ? '#F5A623' : 'none'}
                                                            color="#F5A623"
                                                        />
                                                    ))}
                                                </div>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                    {formatDate(review.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {isAuthenticated && (review.userId === user?.id || review.userId === user?._id || review.userId === user?.uid) && (
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button
                                                    onClick={() => handleEdit(review)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '6px',
                                                        color: 'var(--color-teal)',
                                                    }}
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review._id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '6px',
                                                        color: '#DC2626',
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <p style={{
                                        fontSize: '14px',
                                        color: 'var(--color-text-secondary)',
                                        lineHeight: '1.6',
                                        marginTop: '12px',
                                    }}>
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;