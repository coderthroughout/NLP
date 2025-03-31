// src/services/researchService.js
import axios from 'axios';

const BASE_URL = '/api/v1/cad';

const researchService = {
  performResearch: async (query, designType) => {
    try {
      const response = await axios.post(`${BASE_URL}/generate`, {
        design_type: designType,
        specifications: {
          dimensions: {
            height: 100,
            width: 50,
            length: 75
          },
          material: 'aluminum',
          specifications: {
            tolerance: '0.1mm'
          }
        },
        research_results: [query],
        version: '1.0'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Research failed');
    }
  },

  validateResults: async (instructions) => {
    try {
      const response = await axios.post(`${BASE_URL}/validate`, {
        design_type: '3D_MODEL',
        instructions: instructions,
        parameters: {
          dimensions: {
            height: 100,
            width: 50,
            length: 75
          },
          material: 'aluminum',
          specifications: {
            tolerance: '0.1mm'
          }
        }
      });
      return {
        isValid: response.data.is_valid,
        validationDetails: response.data.validation_details,
        recommendations: response.data.recommendations,
        performanceMetrics: response.data.performance_metrics
      };
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Validation failed');
    }
  },

  getDesignTemplates: async (designType, complexity = 'medium') => {
    try {
      const response = await axios.get(`${BASE_URL}/templates/${designType}`, {
        params: { complexity }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch templates');
    }
  }
};

export default researchService;