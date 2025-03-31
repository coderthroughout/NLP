// src/components/CAD/OptimizationPanel.js
import React, { useState } from 'react';
import axios from 'axios';

const OptimizationPanel = ({ designInstructions, onOptimizationComplete }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationParams, setOptimizationParams] = useState({
    material_usage: true,
    structural_integrity: true,
    manufacturing_cost: true,
    production_time: true
  });
  const [error, setError] = useState(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setError(null);

    try {
      const response = await axios.post('/api/v1/cad/optimize', {
        instructions: designInstructions,
        parameters: optimizationParams
      });

      onOptimizationComplete(response.data);
    } catch (err) {
      setError('Optimization failed: ' + err.message);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="optimization-panel">
      <h3>Design Optimization</h3>

      <div className="optimization-options">
        <div className="option-group">
          <label>
            <input
              type="checkbox"
              checked={optimizationParams.material_usage}
              onChange={(e) => setOptimizationParams({
                ...optimizationParams,
                material_usage: e.target.checked
              })}
            />
            Material Usage Optimization
          </label>
        </div>

        <div className="option-group">
          <label>
            <input
              type="checkbox"
              checked={optimizationParams.structural_integrity}
              onChange={(e) => setOptimizationParams({
                ...optimizationParams,
                structural_integrity: e.target.checked
              })}
            />
            Structural Integrity
          </label>
        </div>

        <div className="option-group">
          <label>
            <input
              type="checkbox"
              checked={optimizationParams.manufacturing_cost}
              onChange={(e) => setOptimizationParams({
                ...optimizationParams,
                manufacturing_cost: e.target.checked
              })}
            />
            Manufacturing Cost
          </label>
        </div>

        <div className="option-group">
          <label>
            <input
              type="checkbox"
              checked={optimizationParams.production_time}
              onChange={(e) => setOptimizationParams({
                ...optimizationParams,
                production_time: e.target.checked
              })}
            />
            Production Time
          </label>
        </div>
      </div>

      <div className="optimization-actions">
        <button
          className="optimize-button"
          onClick={handleOptimize}
          disabled={isOptimizing || !designInstructions?.length}
        >
          {isOptimizing ? 'Optimizing...' : 'Optimize Design'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default OptimizationPanel;