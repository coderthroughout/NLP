// src/components/CAD/ValidationDisplay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ValidationDisplay = ({ designInstructions }) => {
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (designInstructions?.length > 0) {
      validateDesign();
    }
  }, [designInstructions]);

  const validateDesign = async () => {
    setIsValidating(true);
    setError(null);

    try {
      const response = await axios.post('/api/v1/cad/validate', {
        design_type: "3D_MODEL",
        instructions: designInstructions,
        parameters: {
          dimensions: {
            height: 100,
            width: 50,
            length: 75
          },
          material: "aluminum",
          specifications: {
            tolerance: "0.1mm"
          }
        }
      });

      setValidationResults(response.data);
    } catch (err) {
      setError('Validation failed: ' + err.message);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="validation-display">
      <h3>Design Validation</h3>

      {isValidating ? (
        <div className="validation-loading">
          Validating design...
        </div>
      ) : validationResults ? (
        <div className="validation-results">
          <div className={`validation-status ${validationResults.is_valid ? 'valid' : 'invalid'}`}>
            <h4>Status: {validationResults.is_valid ? 'Valid' : 'Invalid'}</h4>
          </div>

          {validationResults.validation_details && (
            <div className="validation-details">
              <h4>Validation Details</h4>
              <ul>
                {validationResults.validation_details.map((detail, index) => (
                  <li key={index} className="detail-item">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validationResults.recommendations && (
            <div className="recommendations">
              <h4>Recommendations</h4>
              <ul>
                {validationResults.recommendations.map((rec, index) => (
                  <li key={index} className="recommendation-item">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validationResults.performance_metrics && (
            <div className="metrics">
              <h4>Performance Metrics</h4>
              <div className="metrics-grid">
                {Object.entries(validationResults.performance_metrics).map(([key, value]) => (
                  <div key={key} className="metric-item">
                    <span className="metric-label">{key}:</span>
                    <span className="metric-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ValidationDisplay;