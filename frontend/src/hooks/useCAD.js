// src/hooks/useCAD.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const useCAD = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const generateInstructions = useCallback(async (designData) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post('/api/v1/cad/generate', {
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
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate CAD instructions');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const validateDesign = useCallback(async (instructions) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post('/api/v1/cad/validate', {
        design_type: instructions.design_type,
        instructions: instructions.instructions,
        parameters: instructions.parameters
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Design validation failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const optimizeDesign = useCallback(async (instructions) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post('/api/v1/cad/optimize', {
        design_type: instructions.design_type,
        instructions: instructions.instructions,
        parameters: {
          material_usage: true,
          structural_integrity: true,
          manufacturing_cost: true,
          production_time: true
        }
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Design optimization failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getDesignTemplates = useCallback(async (designType, complexity = 'medium') => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.get(`/api/v1/cad/templates/${designType}?complexity=${complexity}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch design templates');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const checkCompatibility = useCallback(async (format, version) => {
    try {
      const response = await axios.get(`/api/v1/cad/compatibility?format=${format}&version=${version}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Compatibility check failed');
      throw err;
    }
  }, []);

  return {
    isProcessing,
    error,
    generateInstructions,
    validateDesign,
    optimizeDesign,
    getDesignTemplates,
    checkCompatibility
  };
};

export default useCAD;