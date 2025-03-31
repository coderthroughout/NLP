// src/components/Layout/Navbar.js
import React, { useState } from 'react';

const Navbar = () => {
  const [activeDesignType, setActiveDesignType] = useState('3D_MODEL');

  const designTypes = [
    { id: '3D_MODEL', label: '3D Models' },
    { id: '2D_DRAWING', label: '2D Drawings' },
    { id: 'ASSEMBLY', label: 'Assemblies' },
    { id: 'PROTOTYPE', label: 'Prototypes' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>NLP CAD Assistant</h1>
      </div>

      <div className="design-type-selector">
        {designTypes.map(type => (
          <button
            key={type.id}
            className={`design-type-button ${activeDesignType === type.id ? 'active' : ''}`}
            onClick={() => setActiveDesignType(type.id)}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="navbar-tools">
        <div className="compatibility-checker">
          <select className="format-selector">
            <option value="obj">OBJ (v2.0, v3.0)</option>
            <option value="stl">STL (ASCII, Binary)</option>
            <option value="step">STEP (AP203, AP214)</option>
            <option value="iges">IGES (5.3, 6.0)</option>
          </select>
        </div>

        <div className="validation-status">
          <span className="status-indicator"></span>
          <span className="status-text">Ready</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;