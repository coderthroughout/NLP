// src/components/Research/ResearchDisplay.js
import React, { useState } from 'react';
import ResultCard from './ResultCard';

const ResearchDisplay = ({ results }) => {
  const [filterConfidence, setFilterConfidence] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredResults = results?.filter(result =>
    result.confidence >= filterConfidence
  ) || [];

  const sortedResults = [...filteredResults].sort((a, b) => {
    const order = sortOrder === 'desc' ? -1 : 1;
    return order * (a.confidence - b.confidence);
  });

  const handleConfidenceChange = (value) => {
    setFilterConfidence(parseFloat(value));
  };

  return (
    <div className="research-display">
      <div className="research-controls">
        <div className="filter-section">
          <label>
            Minimum Confidence:
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={filterConfidence}
              onChange={(e) => handleConfidenceChange(e.target.value)}
            />
            <span>{(filterConfidence * 100).toFixed(0)}%</span>
          </label>
        </div>

        <div className="sort-section">
          <button
            className={`sort-button ${sortOrder === 'desc' ? 'active' : ''}`}
            onClick={() => setSortOrder('desc')}
          >
            Highest Confidence First
          </button>
          <button
            className={`sort-button ${sortOrder === 'asc' ? 'active' : ''}`}
            onClick={() => setSortOrder('asc')}
          >
            Lowest Confidence First
          </button>
        </div>
      </div>

      <div className="results-grid">
        {sortedResults.length > 0 ? (
          sortedResults.map((result, index) => (
            <ResultCard
              key={index}
              result={result}
              onSelect={(instruction) => {
                // Handle instruction selection for CAD generation
                console.log('Selected instruction:', instruction);
              }}
            />
          ))
        ) : (
          <div className="no-results">
            <p>No research results available</p>
          </div>
        )}
      </div>

      {results?.length > 0 && (
        <div className="results-summary">
          <p>Total Results: {results.length}</p>
          <p>Filtered Results: {sortedResults.length}</p>
          <p>Average Confidence: {
            (sortedResults.reduce((acc, curr) => acc + curr.confidence, 0) / sortedResults.length * 100).toFixed(1)
          }%</p>
        </div>
      )}
    </div>
  );
};

export default ResearchDisplay;