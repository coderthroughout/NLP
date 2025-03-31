// src/components/CAD/CADViewer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CADViewer = ({ designData }) => {
  const [design, setDesign] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [optimizationMetrics, setOptimizationMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (designData) {
      validateDesign(designData);
    }
  }, [designData]);

  const validateDesign = async (data) => {
    try {
      const response = await axios.post('/api/v1/cad/validate', {
        design_type: data.design_type,
        instructions: data.instructions,
        parameters: data.parameters
      });
      setValidationResults(response.data);
    } catch (err) {
      setError('Validation failed: ' + err.message);
    }
  };

  const optimizeDesign = async () => {
    try {
      const response = await axios.post('/api/v1/cad/optimize', {
        instructions: design.instructions,
        parameters: {
          material_usage: true,
          structural_integrity: true,
          manufacturing_cost: true,
          production_time: true
        }
      });
      setOptimizationMetrics(response.data.optimization_metrics);
    } catch (err) {
      setError('Optimization failed: ' + err.message);
    }
  };

  return (
    <div className="cad-viewer">
      <div className="cad-viewer-header">
        <h2>CAD Design Viewer</h2>
        {design && (
          <button
            className="optimize-button"
            onClick={optimizeDesign}
          >
            Optimize Design
          </button>
        )}
      </div>

      <div className="design-display">
        {design ? (
          <>
            <div className="design-info">
              <h3>{design.project_name || 'Untitled Design'}</h3>
              <p>Type: {design.design_type}</p>
              <p>Version: {design.version}</p>
            </div>

            <div className="design-instructions">
              <h4>Instructions:</h4>
              <ul>
                {design.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>

            {validationResults && (
              <div className="validation-results">
                <h4>Validation Results</h4>
                <div className={`validation-status ${validationResults.is_valid ? 'valid' : 'invalid'}`}>
                  Status: {validationResults.is_valid ? 'Valid' : 'Invalid'}
                </div>
                {validationResults.validation_details && (
                  <ul className="validation-details">
                    {validationResults.validation_details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {optimizationMetrics && (
              <div className="optimization-metrics">
                <h4>Optimization Results</h4>
                <div className="metrics-grid">
                  <div className="metric">
                    <span>Material Saved:</span>
                    <span>{optimizationMetrics.material_saved}</span>
                  </div>
                  <div className="metric">
                    <span>Strength Improved:</span>
                    <span>{optimizationMetrics.strength_improved}</span>
                  </div>
                  <div className="metric">
                    <span>Cost Reduced:</span>
                    <span>{optimizationMetrics.cost_reduced}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="no-design">
            <p>No design loaded</p>
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

export default CADViewer;