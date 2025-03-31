// src/components/Input/InputSection.js
import React, { useState } from 'react';
import TextInput from './TextInput';
import VoiceInput from './VoiceInput';
import ImageInput from './ImageInput';

const InputSection = () => {
  const [inputType, setInputType] = useState('text');
  const [processingResult, setProcessingResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputProcessed = (result) => {
    setProcessingResult(result);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setProcessingResult(null);
  };

  return (
    <div className="input-section">
      <div className="input-type-selector">
        <button
          className={`type-button ${inputType === 'text' ? 'active' : ''}`}
          onClick={() => setInputType('text')}
        >
          Text Input
        </button>
        <button
          className={`type-button ${inputType === 'voice' ? 'active' : ''}`}
          onClick={() => setInputType('voice')}
        >
          Voice Input
        </button>
        <button
          className={`type-button ${inputType === 'image' ? 'active' : ''}`}
          onClick={() => setInputType('image')}
        >
          CAD Upload
        </button>
      </div>

      <div className="input-container">
        {inputType === 'text' && (
          <TextInput
            onProcessed={handleInputProcessed}
            onError={handleError}
          />
        )}
        {inputType === 'voice' && (
          <VoiceInput
            onProcessed={handleInputProcessed}
            onError={handleError}
          />
        )}
        {inputType === 'image' && (
          <ImageInput
            onImageProcessed={handleInputProcessed}
            onError={handleError}
          />
        )}
      </div>

      {processingResult && (
        <div className="processing-result">
          <h3>Processing Result</h3>
          {processingResult.design_type && (
            <div className="design-info">
              <p>Design Type: {processingResult.design_type}</p>
              <p>Status: {processingResult.status}</p>
              {processingResult.instructions && (
                <div className="instructions-list">
                  <h4>Generated Instructions:</h4>
                  <ul>
                    {processingResult.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default InputSection;