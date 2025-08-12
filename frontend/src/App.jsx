
import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Homepage from './components/pages/Homepage.jsx';
import CompareCars from './components/pages/CompareCars.jsx';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage onNavigation={handleNavigation} />;
      case 'compare':
        return <CompareCars />;
      case 'price-estimator':
        return (
          <div className="page-container">
            <div className="coming-soon">
              <h2>Price Estimator</h2>
              <p>Coming Soon...</p>
            </div>
          </div>
        );
      default:
        return <Homepage onNavigation={handleNavigation} />;
    }
  };

  return (
    <div className="app">
      {currentPage !== 'home' && (
        <Navbar currentPage={currentPage} onNavigation={handleNavigation} />
      )}
      {renderCurrentPage()}
    </div>
  );
};

export default App;
