import React, { useState } from 'react';
import './CompareCars.css';

const CompareCars = () => {
  // Car 1 state
  const [car1, setCar1] = useState({
    make: '',
    model: '',
    year: '',
    engine: '',
    transmission: '',
    fuel_type: '',
    mileage: '',
    features: '',
    condition: 'New',
    price: ''
  });

  // Car 2 state
  const [car2, setCar2] = useState({
    make: '',
    model: '',
    year: '',
    engine: '',
    transmission: '',
    fuel_type: '',
    mileage: '',
    features: '',
    condition: 'New',
    price: ''
  });

  const [comparisonResult, setComparisonResult] = useState(null);
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
    if (carData.price) parts.push(`$${carData.price}`);
    if (carData.features) parts.push(`Features: ${carData.features}`);
    
    return parts.join(', ');
  };

  const handleCompare = async () => {
  setError(null);
  setComparisonResult(null);
  
  // Basic validation
  if (!car1.make || !car1.model || !car2.make || !car2.model) {
    setError('Please enter at least the make and model for both cars.');
    return;
  }

  setIsLoading(true);

  try {
    const car1Description = generateDescription(car1);
    const car2Description = generateDescription(car2);

    // Ensure consistent data types
    const requestBody = {
      car1: { 
        raw_description: car1Description,
        make: car1.make || null,
        model: car1.model || null,
        year: car1.year || null,  // Keep as string since input gives string
        engine: car1.engine || null,
        transmission: car1.transmission || null,
        fuel_type: car1.fuel_type || null,
        mileage: car1.mileage || null,  // Keep as string
        features: car1.features || null,
        condition: car1.condition || "New",
        price: car1.price || null  // Keep as string
      },
      car2: { 
        raw_description: car2Description,
        make: car2.make || null,
        model: car2.model || null,
        year: car2.year || null,
        engine: car2.engine || null,
        transmission: car2.transmission || null,
        fuel_type: car2.fuel_type || null,
        mileage: car2.mileage || null,
        features: car2.features || null,
        condition: car2.condition || "New",
        price: car2.price || null
      }
    };

    // DEBUG: Log the request body
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('http://localhost:8000/api/compare/', {
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
    setComparisonResult(result);
    
  } catch (error) {
    console.error('Error comparing cars:', error);
    setError(`Failed to compare cars: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};


  const clearFields = () => {
    setCar1({
      make: '', model: '', year: '', engine: '', transmission: '',
      fuel_type: '', mileage: '', features: '', condition: 'New', price: ''
    });
    setCar2({
      make: '', model: '', year: '', engine: '', transmission: '',
      fuel_type: '', mileage: '', features: '', condition: 'New', price: ''
    });
    setComparisonResult(null);
    setError(null);
  };

  // Parse and format comparison result
  // Parse and format comparison result
// Parse and format comparison result
const formatComparisonResult = (text) => {
  if (!text) return [];
  
  // Split by numbered sections
  const sections = text.split(/\*\*\d+\./).filter(section => section.trim());
  
  // Also handle **Final Recommendation** section
  const finalRecIndex = text.indexOf('**Final Recommendation**');
  if (finalRecIndex !== -1) {
    const beforeFinal = text.substring(0, finalRecIndex);
    const finalSection = text.substring(finalRecIndex);
    
    // Split the before part and add the final section
    const beforeSections = beforeFinal.split(/\*\*\d+\./).filter(section => section.trim());
    beforeSections.push(finalSection);
    
    return beforeSections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 0) return null;
      
      let title = '';
      let content = lines;
      
      // Extract title
      const firstLine = lines[0];
      if (firstLine.includes('**')) {
        title = firstLine.replace(/\*\*/g, '').trim();
        content = lines.slice(1);
      } else {
        // Try to extract section title from content
        const titleMatch = section.match(/([^*\n]+?)(?:\n|$)/);
        if (titleMatch) {
          title = titleMatch[1].trim();
          content = lines.slice(1);
        }
      }
      
      // Clean up title
      title = title.replace(/^\d+\.\s*/, '').trim();
      
      return {
        id: index,
        title: title || `Section ${index + 1}`,
        content: content.filter(line => line.trim())
      };
    }).filter(Boolean);
  }
  
  // Fallback to original logic
  return sections.map((section, index) => {
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;
    
    const title = lines[0]?.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim() || `Section ${index + 1}`;
    const content = lines.slice(1);
    
    return {
      id: index,
      title: title,
      content: content
    };
  }).filter(Boolean);
};


  return (
    <div className="compare-cars-container">
      <div className="compare-header">
        <h1 className="compare-title">Compare Cars</h1>
        <p className="compare-subtitle">
          Enter detailed specifications for two cars to get an AI-powered comparison
        </p>
      </div>

      <div className="compare-content">
        {/* Input Section */}
        <div className="input-section">
          <div className="car-forms-container">
            
            {/* Car 1 Form */}
            <div className="car-form-card">
              <h3 className="car-form-title">
                <span className="car-number">Car 1</span>
              </h3>
              
              <div className="form-grid">
                <div className="input-field">
                  <label className="field-label">Make</label>
                  <input
                    type="text"
                    className="field-input"
                    value={car1.make}
                    onChange={(e) => setCar1({...car1, make: e.target.value})}
                    placeholder="Enter make"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Model</label>
                  <input
                    type="text"
                    className="field-input"
                    value={car1.model}
                    onChange={(e) => setCar1({...car1, model: e.target.value})}
                    placeholder="Enter model"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Year</label>
                  <input
                    type="number"
                    className="field-input"
                    value={car1.year}
                    onChange={(e) => setCar1({...car1, year: e.target.value})}
                    placeholder="Enter year"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Engine</label>
                  <input
                    type="text"
                    className="field-input"
                    value={car1.engine}
                    onChange={(e) => setCar1({...car1, engine: e.target.value})}
                    placeholder="Enter engine"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Transmission</label>
                  <select
                    className="field-input"
                    value={car1.transmission}
                    onChange={(e) => setCar1({...car1, transmission: e.target.value})}
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
                    value={car1.fuel_type}
                    onChange={(e) => setCar1({...car1, fuel_type: e.target.value})}
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
                  <label className="field-label">Mileage</label>
                  <input
                    type="number"
                    className="field-input"
                    value={car1.mileage}
                    onChange={(e) => setCar1({...car1, mileage: e.target.value})}
                    placeholder="Enter mileage"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Price</label>
                  <input
                    type="number"
                    className="field-input"
                    value={car1.price}
                    onChange={(e) => setCar1({...car1, price: e.target.value})}
                    placeholder="Enter price"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Condition</label>
                  <select
                    className="field-input"
                    value={car1.condition}
                    onChange={(e) => setCar1({...car1, condition: e.target.value})}
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                
                <div className="input-field features-field">
                  <label className="field-label">Features</label>
                  <textarea
                    className="field-input field-textarea"
                    value={car1.features}
                    onChange={(e) => setCar1({...car1, features: e.target.value})}
                    placeholder="Enter additional features (e.g., leather seats, sunroof, navigation system)"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="vs-divider">
              <span className="vs-text">VS</span>
            </div>
            
            {/* Car 2 Form */}
            <div className="car-form-card">
              <h3 className="car-form-title">
                <span className="car-number">Car 2</span>
              </h3>
              
              <div className="form-grid">
                <div className="input-field">
                  <label className="field-label">Make</label>
                  <input
                    type="text"
                    className="field-input"
                    value={car2.make}
                    onChange={(e) => setCar2({...car2, make: e.target.value})}
                    placeholder="Enter make"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Model</label>
                  <input
                    type="text"
                    className="field-input"
                    value={car2.model}
                    onChange={(e) => setCar2({...car2, model: e.target.value})}
                    placeholder="Enter model"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Year</label>
                  <input
                    type="number"
                    className="field-input"
                    value={car2.year}
                    onChange={(e) => setCar2({...car2, year: e.target.value})}
                    placeholder="Enter year"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Engine</label>
                  <input
                    type="text"
                    className="field-input"
                    value={car2.engine}
                    onChange={(e) => setCar2({...car2, engine: e.target.value})}
                    placeholder="Enter engine"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Transmission</label>
                  <select
                    className="field-input"
                    value={car2.transmission}
                    onChange={(e) => setCar2({...car2, transmission: e.target.value})}
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
                    value={car2.fuel_type}
                    onChange={(e) => setCar2({...car2, fuel_type: e.target.value})}
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
                  <label className="field-label">Mileage</label>
                  <input
                    type="number"
                    className="field-input"
                    value={car2.mileage}
                    onChange={(e) => setCar2({...car2, mileage: e.target.value})}
                    placeholder="Enter mileage"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Price</label>
                  <input
                    type="number"
                    className="field-input"
                    value={car2.price}
                    onChange={(e) => setCar2({...car2, price: e.target.value})}
                    placeholder="Enter price"
                  />
                </div>

                <div className="input-field">
                  <label className="field-label">Condition</label>
                  <select
                    className="field-input"
                    value={car2.condition}
                    onChange={(e) => setCar2({...car2, condition: e.target.value})}
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                
                <div className="input-field features-field">
                  <label className="field-label">Features</label>
                  <textarea
                    className="field-input field-textarea"
                    value={car2.features}
                    onChange={(e) => setCar2({...car2, features: e.target.value})}
                    placeholder="Enter additional features (e.g., leather seats, sunroof, navigation system)"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="compare-button"
              onClick={handleCompare}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="compare-icon">⚖️</span>
                  Compare Cars
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
        {/* Results Section */}
{comparisonResult && (
  <div className="results-section">
    <div className="results-header">
      <h2 className="results-main-title">
        <span className="results-icon"></span>
         AI Comparison Results
      </h2>
    </div>

    <div className="comparison-summary">
      <div className="car-summary">
        <h3>🚗 {car1.make} {car1.model} {car1.year}</h3>
        <div className="car-quick-stats">
          {car1.engine && <span className="stat">Engine: {car1.engine}</span>}
          {car1.fuel_type && <span className="stat">Fuel: {car1.fuel_type}</span>}
          {car1.price && <span className="stat">Price: ${car1.price}</span>}
        </div>
      </div>
      
      <div className="car-summary">
        <h3>🚗 {car2.make} {car2.model} {car2.year}</h3>
        <div className="car-quick-stats">
          {car2.engine && <span className="stat">Engine: {car2.engine}</span>}
          {car2.fuel_type && <span className="stat">Fuel: {car2.fuel_type}</span>}
          {car2.price && <span className="stat">Price: ${car2.price}</span>}
        </div>
      </div>
    </div>

    <div className="detailed-comparison">
  {formatComparisonResult(comparisonResult.comparison).map(section => (
    <div key={section.id} className="comparison-section">
      <h3 className="section-title">{section.title}</h3>
      <div className="section-content">
        {section.content.map((line, lineIndex) => {
          // Check if line contains car names to highlight them
          const isCarName = (car1.make && line.includes(car1.make)) || 
                           (car2.make && line.includes(car2.make)) ||
                           line.match(/^[A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+\s+\d{4}:/);
          
          return (
            <div key={lineIndex} className="comparison-point">
              {line.startsWith('•') || line.startsWith('-') ? (
                <div className="bullet-point">{line}</div>
              ) : isCarName ? (
                <div className="car-name-header">{line}</div>
              ) : line.toLowerCase().startsWith('winner:') ? (
                <div className="winner-text">{line}</div>
              ) : (
                <div className="comparison-text">{line}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  ))}
</div>


    
  </div>
)}

      </div>
    </div>
  );
};

export default CompareCars;
