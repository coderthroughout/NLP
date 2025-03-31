// src/services/cadService.js
import axios from 'axios';

const BASE_URL = '/api/v1/cad';

const cadService = {
  generateInstructions: async (requestData) => {
    try {
      const response = await axios.post(`${BASE_URL}/generate`, {
        design_type: requestData.design_type,
        specifications: {
          dimensions: requestData.specifications.dimensions,
          material: requestData.specifications.material,
          tolerance: requestData.specifications.tolerance
        },
        research_results: requestData.research_results,
        project_id: requestData.project_id,
        version: requestData.version || '1.0',
        constraints: requestData.constraints
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to generate CAD instructions');
    }
  },

  validateDesign: async (instruction) => {
    try {
      const response = await axios.post(`${BASE_URL}/validate`, {
        design_type: instruction.design_type,
        instructions: instruction.instructions,
        parameters: instruction.parameters
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Design validation failed');
    }
  },

  optimizeDesign: async (instruction) => {
    try {
      const response = await axios.post(`${BASE_URL}/optimize`, {
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
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Design optimization failed');
    }
  },

  getDesignTemplates: async (designType, complexity = 'medium', scale = 'standard') => {
    try {
      const response = await axios.get(`${BASE_URL}/templates/${designType}`, {
        params: { complexity, scale }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch design templates');
    }
  },

  checkCompatibility: async (format, version) => {
    try {
      const response = await axios.get(`${BASE_URL}/compatibility`, {
        params: { format, version }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Compatibility check failed');
    }
  }
};

export default cadService;