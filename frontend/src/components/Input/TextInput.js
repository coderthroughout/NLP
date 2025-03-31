// src/components/Input/TextInput.js
import React, { useState } from 'react';
import axios from 'axios';

const TextInput = ({ onProcessed, onError }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);

    try {
      const response = await axios.post('/api/v1/cad/generate', {
        design_type: '3D_MODEL',
        specifications: {
          dimensions: {
            height: 100,
            width: 50,
            length: 75
          },
          material: 'aluminum',
          tolerance: '0.1mm'
        },
        research_results: [input]
      });

      onProcessed(response.data);
      setInput('');
    } catch (err) {
      onError(err.response?.data?.detail || 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="text-input">
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter design instructions or requirements..."
          rows={4}
          disabled={isProcessing}
        />

        <div className="input-controls">
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="submit-button"
          >
            {isProcessing ? 'Processing...' : 'Generate CAD Instructions'}
          </button>
        </div>
      </form>

      <div className="input-guidelines">
        <h4>Input Guidelines:</h4>
        <ul>
          <li>Describe the design requirements clearly</li>
          <li>Include specific dimensions if known</li>
          <li>Specify material preferences</li>
          <li>Mention any special requirements or constraints</li>
        </ul>
      </div>
    </div>
  );
};

export default TextInput;