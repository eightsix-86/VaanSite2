'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.from(sectionRef.current.querySelector('.about-heading'), {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.from(sectionRef.current.querySelector('.about-content'), {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out'
    })
  }, [])

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <h2 className="about-heading">About Vaan Bakes</h2>
      <div className="about-content">
        <p className="about-text">
          Welcome to Vaan Bakes, where every creation is crafted with passion and precision. 
          We believe in using only the finest ingredients to bring you desserts that not only 
          look beautiful but taste incredible. From classic favorites to innovative new flavors, 
          each baked good is made fresh daily with love and care. Whether you're celebrating a 
          special occasion or simply treating yourself, we're here to make every moment a little sweeter.
        </p>
      </div>
    </section>
  )
}