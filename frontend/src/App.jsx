
import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Homepage from './components/pages/Homepage.jsx';
import CompareCars from './components/pages/CompareCars.jsx';
import './App.css';
import PriceEstimator from './components/pages/PriceEstimator.jsx';

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
        return <PriceEstimator/>;
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
