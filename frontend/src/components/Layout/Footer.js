// src/components/Layout/Footer.js
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Supported Formats</h4>
          <ul>
            <li>OBJ (v2.0, v3.0)</li>
            <li>STL (ASCII, Binary)</li>
            <li>STEP (AP203, AP214)</li>
            <li>IGES (v5.3, v6.0)</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Design Types</h4>
          <ul>
            <li>3D Models</li>
            <li>2D Drawings</li>
            <li>Assemblies</li>
            <li>Prototypes</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Support: support@nlpcad.com</p>
          <p>Technical: tech@nlpcad.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} NLP CAD Assistant. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;