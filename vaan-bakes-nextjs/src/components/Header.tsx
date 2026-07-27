'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { getCartCount, openCart } = useCart()
  const cartCount = getCartCount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <Link href="/">
          <h1>Vaan Bakes</h1>
        </Link>
      </div>
      <nav className="main-nav">
        <li>
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            HOME
          </Link>
        </li>
        <li>
          <Link href="/store" className={`nav-link ${pathname === '/store' ? 'active' : ''}`}>
            PRODUCTS
          </Link>
        </li>
        <li>
          <Link href="/#about" className="nav-link">
            ABOUT US
          </Link>
        </li>
        <li>
          <Link href="/#contact" className="nav-link">
            CONTACT US
          </Link>
        </li>
        <li>
          <button 
            className="cart-button" 
            id="view-cart-btn"
            onClick={openCart}
            type="button"
          >
            <i className="fas fa-shopping-cart"></i>
            <span id="cart-count">{cartCount}</span>
          </button>
        </li>
      </nav>
    </header>
  )
}