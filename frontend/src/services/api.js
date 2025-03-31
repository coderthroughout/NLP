// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8000/api/v1'
  : '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const cadService = {
  generateInstructions: async (designData) => {
    const response = await api.post('/cad/generate', {
      design_type: designData.design_type,
      specifications: {
        dimensions: designData.dimensions,
        material: designData.material,
        specifications: designData.specifications
      },
      research_results: designData.research_results,
      project_id: designData.project_id,
      version: designData.version
    });
    return response.data;
  },

  validateDesign: async (instruction) => {
    const response = await api.post('/cad/validate', {
      design_type: instruction.design_type,
      instructions: instruction.instructions,
      parameters: instruction.parameters
    });
    return response.data;
  },

  optimizeDesign: async (instruction) => {
    const response = await api.post('/cad/optimize', {
      design_type: instruction.design_type,
      instructions: instruction.instructions,
      parameters: {
        material_usage: true,
        structural_integrity: true,
        manufacturing_cost: true,
        production_time: true
      }
    });
    return response.data;
  },

  getDesignTemplates: async (designType, complexity = 'medium') => {
    const response = await api.get(`/cad/templates/${designType}`, {
      params: { complexity }
    });
    return response.data;
  },

  checkCompatibility: async (format, version) => {
    const response = await api.get('/cad/compatibility', {
      params: { format, version }
    });
    return response.data;
  }
};

api.interceptors.request.use(
  (config) => {
    // Add any request processing here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          throw new Error(data.detail || 'Invalid request');
        case 404:
          throw new Error(data.detail || 'Resource not found');
        case 422:
          throw new Error(data.detail || 'Validation error');
        default:
          throw new Error(data.detail || 'Server error');
      }
    }
    throw error;
  }
);

export default cadService;