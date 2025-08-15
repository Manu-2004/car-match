import React, { useState } from 'react';
import './PriceEstimator.css';

const PriceEstimator = () => {
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    year: '',
    engine: '',
    transmission: '',
    fuel_type: '',
    mileage: '',
    features: '',
    condition: 'Good',
    location: '',
    additional_info: ''
  });

  const [estimationResult, setEstimationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate description from form data
  const generateDescription = (carData) => {
    const parts = [];
    if (carData.make && carData.model) parts.push(`${carData.make} ${carData.model}`);
    if (carData.year) parts.push(carData.year);
    if (carData.engine) parts.push(`${carData.engine} engine`);
    if (carData.transmission) parts.push(`${carData.transmission} transmission`);
    if (carData.fuel_type) parts.push(`${carData.fuel_type} fuel`);
    if (carData.mileage) parts.push(`${carData.mileage} miles`);
    if (carData.condition) parts.push(`${carData.condition} condition`);
    if (carData.location) parts.push(`Located in ${carData.location}`);
    if (carData.features) parts.push(`Features: ${carData.features}`);
    if (carData.additional_info) parts.push(`Additional: ${carData.additional_info}`);
    
    return parts.join(', ');
  };

  const handleEstimate = async () => {
    setError(null);
    setEstimationResult(null);
    
    // Basic validation
    if (!carDetails.make || !carDetails.model) {
      setError('Please enter at least the make and model of your car.');
      return;
    }

    setIsLoading(true);

    try {
      const description = generateDescription(carDetails);

      const requestBody = {
        car_details: {
          raw_description: description,
          make: carDetails.make || null,
          model: carDetails.model || null,
          year: carDetails.year || null,
          engine: carDetails.engine || null,
          transmission: carDetails.transmission || null,
          fuel_type: carDetails.fuel_type || null,
          mileage: carDetails.mileage || null,
          features: carDetails.features || null,
          condition: carDetails.condition || "Good"
        }
      };

      const response = await fetch('http://localhost:8000/api/price/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        
        if (response.status === 422) {
          let errorMessage = 'Validation failed:\n';
          if (errorData.detail && Array.isArray(errorData.detail)) {
            errorData.detail.forEach(error => {
              errorMessage += `- ${error.loc?.join(' -> ') || 'Unknown field'}: ${error.msg}\n`;
            });
          } else {
            errorMessage += JSON.stringify(errorData, null, 2);
          }
          setError(errorMessage);
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        return;
      }

      const result = await response.json();
      setEstimationResult(result);
      
    } catch (error) {
      console.error('Error estimating price:', error);
      setError(`Failed to estimate price: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFields = () => {
    setCarDetails({
      make: '', model: '', year: '', engine: '', transmission: '',
      fuel_type: '', mileage: '', features: '', condition: 'Good', location: '', additional_info: ''
    });
    setEstimationResult(null);
    setError(null);
  };

  const formatPriceRange = (range) => {
    if (range.min && range.max && range.min !== range.max) {
      return `$${range.min.toLocaleString()} - $${range.max.toLocaleString()}`;
    }
    return 'Range not available';
  };

  return (
    <div className="price-estimator-container">
      <div className="estimator-header">
        <h1 className="estimator-title">
          <span className="title-price">Price</span>
          <span className="title-estimator">Estimator</span>
        </h1>
        <p className="estimator-subtitle">
          Get an accurate AI-powered price estimate for your vehicle
        </p>
      </div>

      <div className="estimator-content">
        {/* Input Section */}
        <div className="input-section">
          <div className="estimator-form-container">
            <div className="estimator-form-card">
              <h3 className="form-title">
                <span className="form-icon">🚗</span>
                Vehicle Information
              </h3>
              
              <div className="form-grid">
                <div className="input-field">
                  <label className="field-label">Make *</label>
                  <input
                    type="text"
                    className="field-input"
                    value={carDetails.make}
                    onChange={(e) => setCarDetails({...carDetails, make: e.target.value})}
                    placeholder="e.g., Toyota, Honda, BMW"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Model *</label>
                  <input
                    type="text"
                    className="field-input"
                    value={carDetails.model}
                    onChange={(e) => setCarDetails({...carDetails, model: e.target.value})}
                    placeholder="e.g., Camry, Accord, 3 Series"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Year</label>
                  <input
                    type="number"
                    className="field-input"
                    value={carDetails.year}
                    onChange={(e) => setCarDetails({...carDetails, year: e.target.value})}
                    placeholder="e.g., 2020"
                    min="1990"
                    max="2025"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Mileage</label>
                  <input
                    type="number"
                    className="field-input"
                    value={carDetails.mileage}
                    onChange={(e) => setCarDetails({...carDetails, mileage: e.target.value})}
                    placeholder="Miles driven"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Engine</label>
                  <input
                    type="text"
                    className="field-input"
                    value={carDetails.engine}
                    onChange={(e) => setCarDetails({...carDetails, engine: e.target.value})}
                    placeholder="e.g., 2.5L V6, 1.8L 4-cyl"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Transmission</label>
                  <select
                    className="field-input"
                    value={carDetails.transmission}
                    onChange={(e) => setCarDetails({...carDetails, transmission: e.target.value})}
                  >
                    <option value="">Select Transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                    <option value="Semi-automatic">Semi-automatic</option>
                  </select>
                </div>

                <div className="input-field">
                  <label className="field-label">Fuel Type</label>
                  <select
                    className="field-input"
                    value={carDetails.fuel_type}
                    onChange={(e) => setCarDetails({...carDetails, fuel_type: e.target.value})}
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                  </select>
                </div>

                <div className="input-field">
                  <label className="field-label">Condition</label>
                  <select
                    className="field-input"
                    value={carDetails.condition}
                    onChange={(e) => setCarDetails({...carDetails, condition: e.target.value})}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div className="input-field">
                  <label className="field-label">Location</label>
                  <input
                    type="text"
                    className="field-input"
                    value={carDetails.location}
                    onChange={(e) => setCarDetails({...carDetails, location: e.target.value})}
                    placeholder="City, State"
                  />
                </div>
                
                <div className="input-field features-field">
                  <label className="field-label">Features & Extras</label>
                  <textarea
                    className="field-input field-textarea"
                    value={carDetails.features}
                    onChange={(e) => setCarDetails({...carDetails, features: e.target.value})}
                    placeholder="Leather seats, sunroof, navigation, premium sound system, etc."
                    rows="2"
                  />
                </div>

                <div className="input-field additional-field">
                  <label className="field-label">Additional Information</label>
                  <textarea
                    className="field-input field-textarea"
                    value={carDetails.additional_info}
                    onChange={(e) => setCarDetails({...carDetails, additional_info: e.target.value})}
                    placeholder="Any accidents, modifications, service history, etc."
                    rows="2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="estimate-button"
              onClick={handleEstimate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Analyzing Market...
                </>
              ) : (
                <>
                  <span className="estimate-icon">💰</span>
                  Get Price Estimate
                </>
              )}
            </button>
            <button 
              className="clear-button"
              onClick={clearFields}
              disabled={isLoading}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <div className="error-card">
              <h3>❌ Error</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {estimationResult && (
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-main-title">
                <span className="results-icon">💎</span>
                Price Estimation Results
              </h2>
            </div>

            <div className="estimation-summary">
              <div className="vehicle-summary">
                <h3>🚗 {carDetails.make} {carDetails.model} {carDetails.year}</h3>
                <div className="vehicle-quick-stats">
                  {carDetails.mileage && <span className="stat">Mileage: {carDetails.mileage} miles</span>}
                  {carDetails.condition && <span className="stat">Condition: {carDetails.condition}</span>}
                  {carDetails.location && <span className="stat">Location: {carDetails.location}</span>}
                </div>
              </div>
            </div>

            <div className="price-cards">
              <div className="price-card main-estimate">
                <h3 className="price-card-title">
                  <span className="price-icon">🏷️</span>
                  Estimated Value
                </h3>
                <div className="price-value">
                  {estimationResult.estimated_price}
                </div>
              </div>

              <div className="price-card price-range">
                <h3 className="price-card-title">
                  <span className="price-icon">📊</span>
                  Price Range
                </h3>
                <div className="range-value">
                  {formatPriceRange(estimationResult.price_range)}
                </div>
              </div>
            </div>

            <div className="market-analysis-section">
              <h3 className="analysis-title">
                <span className="analysis-icon">📈</span>
                Market Analysis
              </h3>
              <div className="analysis-content">
                {estimationResult.market_analysis.split('\n').map((line, index) => (
                  line.trim() && (
                    <div key={index} className="analysis-point">
                      {line.trim()}
                    </div>
                  )
                ))}
              </div>
            </div>

            {estimationResult.factors && Object.keys(estimationResult.factors).length > 0 && (
              <div className="factors-section">
                <h3 className="factors-title">
                  <span className="factors-icon">⚖️</span>
                  Key Pricing Factors
                </h3>
                <div className="factors-grid">
                  {Object.entries(estimationResult.factors).map(([factor, description]) => (
                    <div key={factor} className="factor-card">
                      <h4 className="factor-name">{factor.replace('_', ' ').toUpperCase()}</h4>
                      <p className="factor-description">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceEstimator;
