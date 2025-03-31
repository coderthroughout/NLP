// src/components/Research/ResultCard.js
import React from 'react';

const ResultCard = ({ result }) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'high-confidence';
    if (confidence >= 0.5) return 'medium-confidence';
    return 'low-confidence';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="result-card">
      <div className={`confidence-indicator ${getConfidenceColor(result.confidence)}`}>
        {(result.confidence * 100).toFixed(1)}%
      </div>

      <div className="result-content">
        <h3>{result.title}</h3>

        <div className="result-details">
          <p>{result.content}</p>

          {result.design_type && (
            <div className="design-info">
              <span className="design-type">Type: {result.design_type}</span>
              {result.material && (
                <span className="material">Material: {result.material}</span>
              )}
            </div>
          )}

          {result.specifications && (
            <div className="specifications">
              <h4>Specifications:</h4>
              <ul>
                {Object.entries(result.specifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="result-metadata">
          <span className="timestamp">
            {formatTimestamp(result.timestamp)}
          </span>

          <div className="action-buttons">
            <button
              className="apply-button"
              onClick={() => onSelect(result)}
            >
              Apply to Design
            </button>
            <button className="save-button">
              Save Reference
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;