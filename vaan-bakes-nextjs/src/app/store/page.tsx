'use client'

import { use } from 'react'
import ProductCard from '@/components/ProductCard'
import Cart from '@/components/Cart'
import { products } from '@/lib/products'
import { useCart } from '@/hooks/useCart'

export default function StorePage() {
  const { addToCart } = useCart()

  const cakes = products.filter(p => p.category === 'cakes')
  const cupcakes = products.filter(p => p.category === 'cupcakes')
  const cookies = products.filter(p => p.category === 'cookies')

  return (
    <>
      <section className="store-header">
        <h2 className="store-title">Our Store</h2>
        <p className="store-subtitle">Freshly baked with love, delivered to your door</p>
      </section>

      <div className="category-nav">
        <a href="#cakes" className="category-link">Cakes</a>
        <span className="category-divider">|</span>
        <a href="#cupcakes" className="category-link">Cupcakes</a>
        <span className="category-divider">|</span>
        <a href="#cookies" className="category-link">Cookies</a>
      </div>

      <section id="cakes" className="product-category">
        <h2 className="category-heading">Cakes</h2>
        <div className="product-grid">
          {cakes.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={() => addToCart(product)} 
            />
          ))}
        </div>
      </section>

      <section id="cupcakes" className="product-category">
        <h2 className="category-heading">Cupcakes</h2>
        <div className="product-grid">
          {cupcakes.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={() => addToCart(product)} 
            />
          ))}
        </div>
      </section>

      <section id="cookies" className="product-category">
        <h2 className="category-heading">Cookies</h2>
        <div className="product-grid">
          {cookies.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={() => addToCart(product)} 
            />
          ))}
        </div>
      </section>

      <Cart />
    </>
  )
}