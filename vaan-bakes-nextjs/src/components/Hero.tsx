'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

export default function Hero() {
  useEffect(() => {
    // Hero animations
    gsap.from('.hero-heading', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    })

    gsap.from('.hero-buttons', {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'back.out(1.5)',
      delay: 1
    })
  }, [])

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h2 className="hero-heading">
          Baked Fresh Daily<br />
          <span className="highlight">With Love</span>
        </h2>
        <div className="hero-buttons">
          <Link href="/store" className="btn btn-primary">
            Order Now
          </Link>
          <Link href="/#about" className="btn btn-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}