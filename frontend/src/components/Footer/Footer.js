import React from 'react'
import footer_logo from '../../assets/Black Cream Minimalist Monogram Initial Logo (1).png'
import instagram_logo from '../../assets/instagram_icon.png'
import whatsapp_logo from '../../assets/whatsapp_icon.png'
import pintester_logo from '../../assets/pintester_icon.png'
import './Footer.css'

const Footer = () => {
  return (
    <div>
      <div className="footer">
        <div className="footer-logo">
          <img src={footer_logo} alt=""  />
        </div>
        <ul className='footer-links'>
          <li>Company</li>
          <li>Products</li>
          <li>Offices</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
        <div className="footer-social-icons">
          <div className="footer-icons-container">
            <img src={instagram_logo} alt="" />
          </div>
          <div className="footer-icons-container">
            <img src={whatsapp_logo} alt="" />
          </div>
          <div className="footer-icons-container">
            <img src={pintester_logo} alt="" />
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright@2024-All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Footer
