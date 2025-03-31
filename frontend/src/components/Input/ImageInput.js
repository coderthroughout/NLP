// src/components/Input/ImageInput.js
import React, { useState, useCallback } from 'react';
import axios from 'axios';

const ImageInput = ({ onImageProcessed }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const supportedFormats = ['obj', 'stl', 'step', 'iges'];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateFile(file);
    }
  };

  const validateFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();

    if (!supportedFormats.includes(extension)) {
      setError(`Unsupported file format. Supported formats: ${supportedFormats.join(', ')}`);
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size exceeds 50MB limit');
      return;
    }

    setSelectedFile(file);
    setError(null);
    generatePreview(file);
  };

  const generatePreview = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      validateFile(file);
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('design_type', '3D_MODEL');

    try {
      const response = await axios.post('/api/v1/input/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onImageProcessed(response.data);
    } catch (err) {
      setError('Image processing failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="image-input">
      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept=".obj,.stl,.step,.iges"
          onChange={handleFileSelect}
          className="file-input"
        />

        {preview ? (
          <div className="preview">
            <img src={preview} alt="Preview" />
          </div>
        ) : (
          <div className="upload-prompt">
            <p>Drag and drop a CAD file or click to select</p>
            <p className="supported-formats">
              Supported formats: {supportedFormats.join(', ')}
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="file-info">
          <p>Selected file: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
      )}

      <button
        className="process-button"
        onClick={processImage}
        disabled={!selectedFile || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Process Image'}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageInput;