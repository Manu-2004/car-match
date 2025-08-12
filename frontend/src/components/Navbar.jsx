import React from 'react';
import './Navbar.css';

const Navbar = ({ currentPage, onNavigation }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'compare', label: 'Compare Cars' },
    { id: 'price-estimator', label: 'Price Estimator' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Title */}
        <div className="navbar-brand">
          <h2 className="brand-title">
            <span className="brand-car">Car</span>
            <span className="brand-match">Match</span>
          </h2>
        </div>

        {/* Navigation Links */}
        <div className="navbar-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigation(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
