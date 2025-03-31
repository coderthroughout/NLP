// src/context/AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [designState, setDesignState] = useState({
    designType: '3D_MODEL',
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
    instructions: [],
    status: 'pending',
    version: '1.0.0'
  });

  const [processingState, setProcessingState] = useState({
    isLoading: false,
    error: null,
    validationResults: null,
    optimizationMetrics: null
  });

  const updateDesignType = (type) => {
    setDesignState(prev => ({
      ...prev,
      designType: type,
      instructions: []
    }));
  };

  const updateSpecifications = (specs) => {
    setDesignState(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        ...specs
      }
    }));
  };

  const updateInstructions = (instructions) => {
    setDesignState(prev => ({
      ...prev,
      instructions,
      status: 'updated'
    }));
  };

  const setValidationResults = (results) => {
    setProcessingState(prev => ({
      ...prev,
      validationResults: results
    }));
  };

  const setOptimizationMetrics = (metrics) => {
    setProcessingState(prev => ({
      ...prev,
      optimizationMetrics: metrics
    }));
  };

  const value = {
    designState,
    processingState,
    updateDesignType,
    updateSpecifications,
    updateInstructions,
    setValidationResults,
    setOptimizationMetrics,
    setProcessingState
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};