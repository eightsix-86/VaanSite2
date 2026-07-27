'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        {/* Logo + Contact Column */}
        <div className="footer-logo">
          <h3>Vaan Bakes</h3>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <i className="fas fa-phone"></i>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-envelope"></i>
              <span>hello@vaanbakes.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link href="/store" className="footer-link">Order Online</Link>
            <Link href="/refund" className="footer-link">Refund Policy</Link>
            <Link href="/#about" className="footer-link">About Us</Link>
            <Link href="/#contact" className="footer-link">Contact</Link>
          </div>
        </div>

        {/* Social Media Column */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Vaan Bakes. All rights reserved.</p>
      </div>
    </footer>
  )
}