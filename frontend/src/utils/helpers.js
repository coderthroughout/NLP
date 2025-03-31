// src/utils/helpers.js

// Format timestamp to readable date
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Generate unique ID with prefix
export const generateUniqueId = (prefix = 'cad') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Validate dimensions object
export const validateDimensions = (dimensions) => {
  const requiredDimensions = ['height', 'width', 'length'];
  const missingDimensions = requiredDimensions.filter(dim => !(dim in dimensions));

  if (missingDimensions.length > 0) {
    return {
      isValid: false,
      error: `Missing required dimensions: ${missingDimensions.join(', ')}`
    };
  }
  return { isValid: true };
};

// Calculate confidence color
export const getConfidenceColor = (confidence) => {
  if (confidence >= 0.8) return 'high-confidence';
  if (confidence >= 0.5) return 'medium-confidence';
  return 'low-confidence';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check file compatibility
export const checkFileCompatibility = (fileFormat) => {
  const compatibilityMatrix = {
    'obj': ['2.0', '3.0'],
    'stl': ['ascii', 'binary'],
    'step': ['AP203', 'AP214'],
    'iges': ['5.3', '6.0']
  };

  return compatibilityMatrix[fileFormat.toLowerCase()] || null;
};

// Validate design type
export const validateDesignType = (type) => {
  const validTypes = ['3D_MODEL', '2D_DRAWING', 'ASSEMBLY', 'PROTOTYPE'];
  return validTypes.includes(type);
};

// Process research results
export const processResearchResults = (results) => {
  return results.map(result => ({
    ...result,
    confidence: parseFloat(result.confidence || 0).toFixed(2),
    timestamp: result.timestamp || new Date().toISOString()
  }));
};