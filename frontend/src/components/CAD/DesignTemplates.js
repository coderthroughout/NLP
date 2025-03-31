// src/components/CAD/DesignTemplates.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DesignTemplates = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState({});
  const [selectedType, setSelectedType] = useState('3D_MODEL');
  const [complexity, setComplexity] = useState('medium');
  const [error, setError] = useState(null);

  const designTypes = [
    { id: '3D_MODEL', label: '3D Model' },
    { id: '2D_DRAWING', label: '2D Drawing' },
    { id: 'ASSEMBLY', label: 'Assembly' },
    { id: 'PROTOTYPE', label: 'Prototype' }
  ];

  useEffect(() => {
    fetchTemplates(selectedType, complexity);
  }, [selectedType, complexity]);

  const fetchTemplates = async (type, complexity) => {
    try {
      const response = await axios.get(`/api/v1/cad/templates/${type}?complexity=${complexity}`);
      setTemplates(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load templates: ' + err.message);
    }
  };

  const handleTemplateSelect = (template) => {
    const templateData = {
      ...template,
      design_type: selectedType,
      specifications: {
        dimensions: template.dimensions,
        material: template.default_material,
        specifications: {
          tolerance: template.standard_tolerances
        }
      }
    };
    onTemplateSelect(templateData);
  };

  return (
    <div className="design-templates">
      <div className="template-controls">
        <div className="type-selector">
          <label>Design Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {designTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="complexity-selector">
          <label>Complexity:</label>
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          >
            <option value="basic">Basic</option>
            <option value="medium">Medium</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="templates-grid">
        {templates.basic && (
          <div className="template-card" onClick={() => handleTemplateSelect(templates.basic)}>
            <h3>Basic Template</h3>
            <div className="template-details">
              <p>ID: {templates.basic.template_id}</p>
              <p>Material: {templates.basic.default_material}</p>
              <p>Tolerance: {templates.basic.standard_tolerances}</p>
              <div className="dimensions">
                <h4>Dimensions:</h4>
                <ul>
                  {Object.entries(templates.basic.dimensions).map(([key, value]) => (
                    <li key={key}>{`${key}: ${value}`}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {templates.advanced && (
          <div className="template-card" onClick={() => handleTemplateSelect(templates.advanced)}>
            <h3>Advanced Template</h3>
            <div className="template-details">
              <p>ID: {templates.advanced.template_id}</p>
              <p>Parametric Rules: {templates.advanced.parametric_rules ? 'Yes' : 'No'}</p>
              <p>Assembly Support: {templates.advanced.assembly_support ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default DesignTemplates;