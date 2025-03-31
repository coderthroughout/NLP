// src/hooks/useResearch.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const useResearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const performResearch = useCallback(async (query, designType) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/v1/cad/generate', {
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

      return {
        instructions: response.data.instructions,
        metadata: response.data.metadata,
        verificationStatus: response.data.metadata.verification_status
      };
    } catch (err) {
      setError(err.response?.data?.detail || 'Research failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateResearchResults = useCallback(async (instructions) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/v1/cad/validate', {
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
    } catch (err) {
      setError(err.response?.data?.detail || 'Validation failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDesignTemplates = useCallback(async (designType, complexity = 'medium') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/v1/cad/templates/${designType}?complexity=${complexity}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch templates');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    performResearch,
    validateResearchResults,
    getDesignTemplates
  };
};

export default useResearch;