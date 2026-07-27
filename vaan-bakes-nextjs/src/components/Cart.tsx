'use client'

import { useCart } from '@/hooks/useCart'
import { useState } from 'react'
import CheckoutModal from './CheckoutModal'
import Image from 'next/image'

export default function Cart() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, getTotal } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  if (!isOpen) return null

  return (
    <>
      <div className="modal active" onClick={closeCart}>
        <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close-btn" onClick={closeCart}>&times;</span>
          <h2>Your Cart</h2>
          
          {items.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              Your cart is empty
            </p>
          ) : (
            <>
              <div id="cart-items">
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="cart-item-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/placeholder.jpg'
                      }}
                      unoptimized
                    />
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </div>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-total">
                <strong>Total:</strong> 
                <span id="cart-total-price">${getTotal().toFixed(2)}</span>
              </div>
              
              <button 
                className="checkout-button"
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal 
          onClose={() => setShowCheckout(false)} 
          total={getTotal()}
        />
      )}
    </>
  )
}