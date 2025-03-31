// src/utils/validators.js

// Validate design type
export const validateDesignType = (type) => {
  const validTypes = ['3D_MODEL', '2D_DRAWING', 'ASSEMBLY', 'PROTOTYPE'];
  return {
    isValid: validTypes.includes(type),
    error: validTypes.includes(type) ? null : 'Invalid design type'
  };
};

// Validate dimensions
export const validateDimensions = (dimensions) => {
  const requiredDimensions = ['height', 'width', 'length'];
  const missingDimensions = requiredDimensions.filter(dim => !dimensions[dim]);

  return {
    isValid: missingDimensions.length === 0,
    error: missingDimensions.length ? `Missing dimensions: ${missingDimensions.join(', ')}` : null
  };
};

// Validate file format
export const validateFileFormat = (format) => {
  const supportedFormats = ['obj', 'stl', 'step', 'iges'];
  const formatLower = format.toLowerCase();

  return {
    isValid: supportedFormats.includes(formatLower),
    error: supportedFormats.includes(formatLower) ? null : 'Unsupported file format'
  };
};

// Validate specifications
export const validateSpecifications = (specs) => {
  const required = ['dimensions', 'material'];
  const missing = required.filter(field => !specs[field]);

  return {
    isValid: missing.length === 0,
    error: missing.length ? `Missing specifications: ${missing.join(', ')}` : null
  };
};

// Validate CAD instructions
export const validateInstructions = (instructions) => {
  if (!Array.isArray(instructions) || instructions.length === 0) {
    return {
      isValid: false,
      error: 'Instructions must be a non-empty array'
    };
  }

  const invalidInstructions = instructions.filter(instruction => !instruction || typeof instruction !== 'string');

  return {
    isValid: invalidInstructions.length === 0,
    error: invalidInstructions.length ? 'Invalid instruction format' : null
  };
};

// Validate optimization parameters
export const validateOptimizationParams = (params) => {
  const validParams = ['material_usage', 'structural_integrity', 'manufacturing_cost', 'production_time'];
  const invalidParams = Object.keys(params).filter(param => !validParams.includes(param));

  return {
    isValid: invalidParams.length === 0,
    error: invalidParams.length ? `Invalid optimization parameters: ${invalidParams.join(', ')}` : null
  };
};