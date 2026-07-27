'use client'

import Image from 'next/image'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart: () => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart()
    // Show success message
    const message = document.createElement('div')
    message.textContent = `${product.name} added to cart!`
    message.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #DB7F8E;
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `
    document.body.appendChild(message)
    
    setTimeout(() => {
      message.style.animation = 'slideOut 0.3s ease-in'
      setTimeout(() => message.remove(), 300)
    }, 2000)
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={220}
          className="product-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/images/placeholder.jpg'
          }}
          unoptimized
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}