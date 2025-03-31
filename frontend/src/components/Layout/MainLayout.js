// src/components/Layout/MainLayout.js
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />

      <div className="content-wrapper">
        <div className="design-type-banner">
          <h2>Supported Design Types</h2>
          <div className="design-types">
            <span className="design-type">3D Models</span>
            <span className="design-type">2D Drawings</span>
            <span className="design-type">Assemblies</span>
            <span className="design-type">Prototypes</span>
          </div>
        </div>

        <main className="main-content">
          {children}
        </main>

        <div className="compatibility-info">
          <h3>File Compatibility</h3>
          <div className="format-grid">
            <div className="format-item">
              <h4>OBJ</h4>
              <p>Versions: 2.0, 3.0</p>
            </div>
            <div className="format-item">
              <h4>STL</h4>
              <p>Types: ASCII, Binary</p>
            </div>
            <div className="format-item">
              <h4>STEP</h4>
              <p>Versions: AP203, AP214</p>
            </div>
            <div className="format-item">
              <h4>IGES</h4>
              <p>Versions: 5.3, 6.0</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;