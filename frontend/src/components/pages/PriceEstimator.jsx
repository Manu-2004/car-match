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
    mileage_unit: 'miles', // New field for mileage unit
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
    if (carData.mileage) parts.push(`${carData.mileage} ${carData.mileage_unit}`);
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
          mileage_unit: carDetails.mileage_unit || "miles",
          features: carDetails.features || null,
          condition: carDetails.condition || "Good",
          location: carDetails.location || null
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
      fuel_type: '', mileage: '', mileage_unit: 'miles', features: '', 
      condition: 'Good', location: '', additional_info: ''
    });
    setEstimationResult(null);
    setError(null);
  };

  // Updated price range parsing function
// Fixed price range parsing function
// Fixed price range parsing with proper currency handling
// Fixed price parsing that works with the corrected backend
// Ultra-safe price parsing function
const parseEstimatedPrice = (estimationResult) => {
  console.log('Raw estimation result:', estimationResult);
  
  let minPrice = null;
  let maxPrice = null;
  
  try {
    // Method 1: Try display values
    if (estimationResult.price_range?.min_display && estimationResult.price_range?.max_display) {
      minPrice = String(estimationResult.price_range.min_display).replace(/^undefined/, '').trim();
      maxPrice = String(estimationResult.price_range.max_display).replace(/^undefined/, '').trim();
    }
    
    // Method 2: Try numeric values
    else if (estimationResult.price_range?.min && estimationResult.price_range?.max) {
      const minVal = Number(estimationResult.price_range.min);
      const maxVal = Number(estimationResult.price_range.max);
      
      if (!isNaN(minVal) && !isNaN(maxVal) && minVal > 0) {
        // Auto-detect currency based on value
        if (minVal > 50000) {
          minPrice = `₹${minVal.toLocaleString('en-IN')}`;
          maxPrice = `₹${maxVal.toLocaleString('en-IN')}`;
        } else {
          minPrice = `$${minVal.toLocaleString('en-US')}`;
          maxPrice = `$${maxVal.toLocaleString('en-US')}`;
        }
      }
    }
    
    // Method 3: Fallback to estimated_price
    if (!minPrice && estimationResult.estimated_price) {
      const priceStr = String(estimationResult.estimated_price).replace(/^undefined/, '').trim();
      if (priceStr && priceStr !== 'Price estimate included in analysis') {
        minPrice = maxPrice = priceStr;
      }
    }
    
    // Final cleanup
    if (minPrice) minPrice = minPrice.replace(/^undefined/, '').trim();
    if (maxPrice) maxPrice = maxPrice.replace(/^undefined/, '').trim();
    
  } catch (error) {
    console.error('Error parsing prices:', error);
    minPrice = maxPrice = 'Price not available';
  }
  
  console.log('Final parsed prices:', { minPrice, maxPrice });
  return { minPrice, maxPrice };
};



// Fixed key pricing factors parsing
// Fixed key pricing factors parsing
const parseKeyPricingFactors = (marketAnalysisText, factorsObject) => {
  const factors = {};
  
  // Debug log to see what we're working with
  console.log('Market Analysis Text:', marketAnalysisText);
  console.log('Factors Object:', factorsObject);
  
  // First try to get from the factors object if available
  if (factorsObject && typeof factorsObject === 'object' && Object.keys(factorsObject).length > 0) {
    Object.entries(factorsObject).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim().length > 0) {
        // Clean up the key
        const cleanKey = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
          .replace(' Impact', '')
          .replace(' Assessment', '');
        
        // Clean up the value - remove leading dashes and extra whitespace
        const cleanValue = value
          .replace(/^[-•*]\s*/, '')
          .replace(/^\w+\s*Impact:\s*/, '')
          .replace(/^\w+\s*Assessment:\s*/, '')
          .trim();
        
        if (cleanValue.length > 0) {
          factors[cleanKey] = cleanValue;
        }
      }
    });
  }
  
  // If no factors from object or factors are incomplete, parse from market analysis text
  if (Object.keys(factors).length === 0 && marketAnalysisText) {
    const lines = marketAnalysisText.split('\n');
    let inFactorsSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if we've entered the Key Pricing Factors section
      if (line.toLowerCase().includes('key pricing factors') ||
          line.toLowerCase().includes('pricing factors:')) {
        inFactorsSection = true;
        continue;
      }
      
      // Check if we've left the factors section (new major section)
      if (inFactorsSection && line.match(/^\*\*[^*]+\*\*/) && 
          !line.toLowerCase().includes('factor') && 
          !line.toLowerCase().includes('pricing')) {
        break;
      }
      
      // Parse factor lines in various formats
      if (inFactorsSection && line) {
        // Format: "- Factor Name: Description"
        let match = line.match(/^-\s*([^:]+):\s*(.+)$/);
        if (match) {
          const factorName = match[1].trim()
            .replace(/\s+Impact$/, '')
            .replace(/\s+Assessment$/, '')
            .replace(/\s+Factors?$/, '');
          const factorDesc = match.trim();
          
          if (factorDesc.length > 10) { // Only add if description is meaningful
            factors[factorName] = factorDesc;
          }
          continue;
        }
        
        // Format: "Factor Name: Description" (without dash)
        match = line.match(/^([A-Za-z][^:-]+):\s*(.+)$/);
        if (match && !match[1].includes('ESTIMATED') && !match[1].includes('MARKET')) {
          const factorName = match[1].trim()
            .replace(/\s+Impact$/, '')
            .replace(/\s+Assessment$/, '')
            .replace(/\s+Factors?$/, '');
          const factorDesc = match.trim();
          
          if (factorDesc.length > 10) {
            factors[factorName] = factorDesc;
          }
        }
      }
    }
  }
  
  // If still no factors, try to extract from any part of the text
  if (Object.keys(factors).length === 0 && marketAnalysisText) {
    const allLines = marketAnalysisText.split('\n');
    
    allLines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Look for any line with factor-like patterns
      const factorPatterns = [
        /^-\s*(Mileage[^:]*|Condition[^:]*|Market[^:]*|Location[^:]*|Age[^:]*|Depreciation[^:]*|Features?[^:]*):\s*(.+)$/i,
        /^(Mileage[^:]*|Condition[^:]*|Market[^:]*|Location[^:]*|Age[^:]*|Depreciation[^:]*|Features?[^:]*):\s*(.+)$/i
      ];
      
      factorPatterns.forEach(pattern => {
        const match = trimmedLine.match(pattern);
        if (match && match[2] && match[2].trim().length > 10) {
          const factorName = match[1].trim()
            .replace(/\s+Impact$/, '')
            .replace(/\s+Assessment$/, '')
            .replace(/\s+Factors?$/, '');
          const factorDesc = match.trim();
          
          factors[factorName] = factorDesc;
        }
      });
    });
  }
  
  console.log('Final parsed factors:', factors);
  return factors;
};


// Enhanced market analysis parsing
// Enhanced market analysis parsing (excludes Key Pricing Factors)
const parseMarketAnalysis = (text) => {
  if (!text) return [];
  
  const sections = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  let currentSection = null;
  let skipSection = false;
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Check if line is a section header
    const isHeader = trimmedLine.match(/^\*\*(.*?)\*\*/) || 
                    (trimmedLine.endsWith(':') && trimmedLine.length < 100) ||
                    trimmedLine.includes('ANALYSIS') || 
                    trimmedLine.includes('TRENDS') || 
                    trimmedLine.includes('DEMAND') || 
                    trimmedLine.includes('SUPPLY') ||
                    trimmedLine.includes('FACTORS') ||
                    trimmedLine.includes('DEPRECIATION') ||
                    trimmedLine.includes('LOCATION') ||
                    trimmedLine.includes('CONDITION') ||
                    trimmedLine.includes('RECOMMENDATIONS') ||
                    trimmedLine.includes('IMPACT');
    
    if (isHeader) {
      // Save previous section if exists and not skipped
      if (currentSection && currentSection.content.length > 0 && !skipSection) {
        sections.push(currentSection);
      }
      
      // Check if this is the "Key Pricing Factors" section to skip
      skipSection = trimmedLine.toLowerCase().includes('key pricing factors') || 
                   trimmedLine.toLowerCase().includes('pricing factors');
      
      if (!skipSection) {
        // Create new section
        let title = trimmedLine.replace(/\*\*/g, '').replace(/:$/, '').trim();
        title = title.replace(/^[A-Z\s]+:/, '').trim();
        
        currentSection = {
          title: title,
          content: []
        };
      } else {
        currentSection = null;
      }
    } 
    else if (currentSection && trimmedLine && !skipSection) {
      // Process content lines
      let cleanLine = trimmedLine;
      
      // Remove bullet points and dashes
      cleanLine = cleanLine.replace(/^[•\-*]\s*/, '');
      
      // Skip lines that look like key pricing factors (start with "- FactorName:")
      if (cleanLine.match(/^[A-Za-z\s]+:\s/)) {
        return; // Skip this line as it's likely a pricing factor
      }
      
      // Skip very short lines
      if (cleanLine.length > 10) {
        // Limit line length for readability
        if (cleanLine.length > 200) {
          cleanLine = cleanLine.substring(0, 200) + '...';
        }
        currentSection.content.push(cleanLine);
      }
    }
  });
  
  // Add final section if not skipped
  if (currentSection && currentSection.content.length > 0 && !skipSection) {
    sections.push(currentSection);
  }
  
  // If no sections found, create a single section with filtered content
  if (sections.length === 0 && text.trim()) {
    const filteredText = text.split('\n')
      .filter(line => !line.toLowerCase().includes('key pricing factors'))
      .filter(line => !line.match(/^[•\-*]\s*[A-Za-z\s]+:\s/))
      .join('\n')
      .trim();
    
    if (filteredText) {
      sections.push({
        title: 'Market Analysis',
        content: [filteredText]
      });
    }
  }
  
  return sections;
};

// Enhanced function to parse key pricing factors from the response




 


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

                <div className="input-field mileage-field">
                  <label className="field-label">Mileage</label>
                  <div className="mileage-input-group">
                    <input
                      type="number"
                      className="field-input mileage-number"
                      value={carDetails.mileage}
                      onChange={(e) => setCarDetails({...carDetails, mileage: e.target.value})}
                      placeholder="Distance driven"
                    />
                    <select
                      className="field-input mileage-unit"
                      value={carDetails.mileage_unit}
                      onChange={(e) => setCarDetails({...carDetails, mileage_unit: e.target.value})}
                    >
                      <option value="miles">Miles</option>
                      <option value="km">KM</option>
                    </select>
                  </div>
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
                    placeholder="City, State/Country"
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
          {carDetails.mileage && <span className="stat">Mileage: {carDetails.mileage} {carDetails.mileage_unit}</span>}
          {carDetails.condition && <span className="stat">Condition: {carDetails.condition}</span>}
          {carDetails.location && <span className="stat">Location: {carDetails.location}</span>}
        </div>
      </div>
    </div>

    {/* Fixed Price Range Card */}
    {/* Enhanced Price Range Card */}
<div className="price-range-card">
  <h3 className="price-range-title">
    <span className="price-icon">💰</span>
    Estimated Price Range
  </h3>
  <div className="price-range-content">
    {(() => {
      const { minPrice, maxPrice, currency } = parseEstimatedPrice(estimationResult);
      
      console.log('Displaying prices:', { minPrice, maxPrice }); // Debug log
      
      if (minPrice && maxPrice) {
        // Ensure both prices have currency symbols
        const displayMinPrice = minPrice.includes(currency) ? minPrice : `${currency}${minPrice}`;
        const displayMaxPrice = maxPrice.includes(currency) ? maxPrice : `${currency}${maxPrice}`;
        
        if (minPrice === maxPrice) {
          return (
            <div className="price-display single-price">
              {displayMinPrice}
            </div>
          );
        } else {
          return (
            <div className="price-display range-price">
              <span className="min-price">{displayMinPrice}</span>
              <span className="price-separator"> - </span>
              <span className="max-price">{displayMaxPrice}</span>
            </div>
          );
        }
      } else {
        // Fallback display
        let fallbackPrice = estimationResult.estimated_price?.toString() || 'Price not available';
        
        // Add currency if missing
        if (fallbackPrice !== 'Price not available' && !fallbackPrice.match(/[₹$€£¥]/)) {
          fallbackPrice = `$${fallbackPrice}`;
        }
        
        return (
          <div className="price-display fallback-price">
            {fallbackPrice}
          </div>
        );
      }
    })()}
    
  </div>
</div>

    {/* Market Analysis */}
    <div className="market-analysis-section">
      <h3 className="analysis-title">
        <span className="analysis-icon">📈</span>
        Market Analysis
      </h3>
      <div className="analysis-sections">
        {parseMarketAnalysis(estimationResult.market_analysis).map((section, index) => (
          <div key={index} className="analysis-section">
            <div className="analysis-section-header">
              <h4 className="analysis-section-title">
                <span className="section-number">{index + 1}</span>
                <span className="section-icon">
                  {section.title.toLowerCase().includes('trend') ? '📊' :
                   section.title.toLowerCase().includes('demand') ? '📈' :
                   section.title.toLowerCase().includes('depreciation') ? '📉' :
                   section.title.toLowerCase().includes('location') ? '🌍' :
                   section.title.toLowerCase().includes('condition') ? '⚙️' :
                   section.title.toLowerCase().includes('recommendation') ? '💡' :
                   '📋'}
                </span>
                {section.title}
              </h4>
            </div>
            <div className="analysis-section-content">
              {section.content.map((line, lineIndex) => (
                <div key={lineIndex} className="analysis-point">
                  <span className="point-indicator">▸</span>
                  <span className="point-text">{line}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Fixed Key Pricing Factors */}
    {(() => {
      const parsedFactors = parseKeyPricingFactors(
        estimationResult.market_analysis, 
        estimationResult.factors
      );
      
      console.log('Parsed factors:', parsedFactors); // Debug log
      
      return Object.keys(parsedFactors).length > 0 ? (
        <div className="factors-section">
          <h3 className="factors-title">
            <span className="factors-icon">⚖️</span>
            Key Pricing Factors
          </h3>
          <div className="factors-grid">
            {Object.entries(parsedFactors).map(([factor, description], index) => (
              <div key={index} className="factor-card">
                <div className="factor-header">
                  <span className="factor-icon">
                    {factor.toLowerCase().includes('mileage') ? '🛣️' :
                     factor.toLowerCase().includes('condition') ? '⚙️' :
                     factor.toLowerCase().includes('demand') || factor.toLowerCase().includes('market') ? '📈' :
                     factor.toLowerCase().includes('location') ? '🌍' :
                     factor.toLowerCase().includes('age') || factor.toLowerCase().includes('depreciation') ? '📅' :
                     factor.toLowerCase().includes('features') ? '✨' :
                     '🔧'}
                  </span>
                  <h4 className="factor-name">{factor}</h4>
                </div>
                <p className="factor-description">{description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null;
    })()}
  </div>
)}



        
      </div>
    </div>
  );
};

export default PriceEstimator;
