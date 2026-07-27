'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll('.timeline-card')
    
    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out'
      })
    })
  }, [])

  return (
    <section className="timeline-section" ref={sectionRef}>
      <h2 className="section-heading">Our Process</h2>
      <div className="timeline-container">
        <div className="timeline-card">
          <div className="timeline-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <h3>1. Order</h3>
          <p>Browse our selection and place your order online or by phone</p>
        </div>
        
        <div className="timeline-card">
          <div className="timeline-icon">
            <i className="fas fa-blender"></i>
          </div>
          <h3>2. Bake</h3>
          <p>We bake your order fresh using premium ingredients</p>
        </div>
        
        <div className="timeline-card">
          <div className="timeline-icon">
            <i className="fas fa-box"></i>
          </div>
          <h3>3. Package</h3>
          <p>Carefully packaged to ensure perfect delivery</p>
        </div>
        
        <div className="timeline-card">
          <div className="timeline-icon">
            <i className="fas fa-truck"></i>
          </div>
          <h3>4. Deliver</h3>
          <p>Fast delivery straight to your doorstep</p>
        </div>
      </div>
    </section>
  )
}