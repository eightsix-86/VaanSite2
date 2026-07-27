'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Cake3D() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    // Animate text on scroll
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top center',
      onEnter: () => setTextVisible(true),
      onLeaveBack: () => setTextVisible(false)
    })
  }, [])

  return (
    <div className="cake-3d-section" ref={sectionRef}>
      <div className="cake-container">
        {/* Placeholder for 3D cake - will implement with Three.js later */}
        <div className="cake-placeholder">
          <img 
            src="/images/cake-3d-placeholder.png" 
            alt="3D Cake" 
            className="cake-image"
            onError={(e) => {
              // Fallback if image doesn't exist
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
        
        <div className={`cake-text-content ${textVisible ? 'visible' : ''}`}>
          <h3 className="subheading">Every Cake Tells a Story</h3>
          <p className="paragraph">
            Our cakes are more than just desserts—they're edible works of art. Each layer is 
            carefully baked, filled, and frosted to perfection. We use premium ingredients, 
            real butter, fresh eggs, and pure vanilla to create flavors that will transport 
            you to dessert heaven. Whether it's a birthday, wedding, or just because, our 
            cakes make every celebration memorable.
          </p>
        </div>
      </div>
    </div>
  )
}