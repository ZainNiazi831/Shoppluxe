import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

const CartIcon = () => {
    const { getItemCount } = useCart();
    const count = getItemCount();

    return (
        <Link to="/cart" style={{ color: '#333', textDecoration: 'none', position: 'relative' }}>
            <ShoppingBag size={22} style={{ cursor: 'pointer' }} />
            {count > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: '#6c63ff',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    minWidth: '18px',
                    textAlign: 'center'
                }}>
                    {count}
                </span>
            )}
        </Link>
    );
};

export default CartIcon;