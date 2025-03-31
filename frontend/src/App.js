// src/App.js
import React from 'react';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/Layout/MainLayout';
import InputSection from './components/Input/InputSection';
import CADViewer from './components/CAD/CADViewer';
import ResearchDisplay from './components/Research/ResearchDisplay';
import './App.css';

function App() {
  return (
    <AppProvider>
      <MainLayout>
        <div className="app-container">
          <div className="input-container">
            <InputSection />
          </div>

          <div className="main-content">
            <div className="cad-section">
              <CADViewer />
            </div>

            <div className="research-section">
              <ResearchDisplay />
            </div>
          </div>
        </div>
      </MainLayout>
    </AppProvider>
  );
}

export default App;