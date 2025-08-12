import React, { useState } from 'react';
import './CompareCars.css';

const CompareCars = () => {
  const [car1Details, setCar1Details] = useState('');
  const [car2Details, setCar2Details] = useState('');
  const [comparisonResult, setComparisonResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    if (!car1Details.trim() || !car2Details.trim()) {
      setComparisonResult('Please enter details for both cars to compare.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - replace with your actual comparison logic
    setTimeout(() => {
      const mockComparison = generateMockComparison(car1Details, car2Details);
      setComparisonResult(mockComparison);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockComparison = (car1, car2) => {
    return `
**Comparison Results:**

**Car 1:** ${car1}
**Car 2:** ${car2}

**Analysis:**
Based on the provided details, here's a comprehensive comparison:

• **Performance**: Both vehicles offer distinct advantages in different scenarios
• **Fuel Efficiency**: Varies based on engine specifications and driving conditions  
• **Features**: Each car comes with unique technology and comfort features
• **Value**: Consider total cost of ownership including maintenance and resale value
• **Suitability**: Your choice should align with your specific needs and preferences

**Recommendation:** 
For a detailed comparison, please provide specific details like model year, engine type, mileage, and key features you're interested in comparing.
    `;
  };

  const clearFields = () => {
    setCar1Details('');
    setCar2Details('');
    setComparisonResult('');
  };

  return (
    <div className="compare-cars-container">
      <div className="compare-header">
        <h1 className="compare-title">Compare Cars</h1>
        <p className="compare-subtitle">
          Enter details about two cars to get a comprehensive comparison
        </p>
      </div>

      <div className="compare-content">
        {/* Input Section */}
        <div className="input-section">
          <div className="car-input-container">
            <div className="car-input-card">
              <h3 className="input-title">
                <span className="car-number">Car 1</span>
              </h3>
              <textarea
                className="car-input"
                placeholder="Enter details for Car 1 (e.g., Toyota Camry 2023, 2.5L engine, automatic transmission, 30 mpg, leather seats, sunroof...)"
                value={car1Details}
                onChange={(e) => setCar1Details(e.target.value)}
                rows="4"
              />
            </div>

            <div className="vs-divider">
              <span className="vs-text">VS</span>
            </div>

            <div className="car-input-card">
              <h3 className="input-title">
                <span className="car-number">Car 2</span>
              </h3>
              <textarea
                className="car-input"
                placeholder="Enter details for Car 2 (e.g., Honda Accord 2023, 1.5L turbo, CVT transmission, 32 mpg, premium audio, heated seats...)"
                value={car2Details}
                onChange={(e) => setCar2Details(e.target.value)}
                rows="4"
              />
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

        {/* Results Section */}
        <div className="results-section">
          <div className="results-card">
            <h3 className="results-title">
              <span className="results-icon">📊</span>
              Comparison Results
            </h3>
            <div className="results-content">
              {comparisonResult ? (
                <div className="comparison-text">
                  {comparisonResult.split('\n').map((line, index) => (
                    <div key={index} className="result-line">
                      {line.startsWith('**') && line.endsWith('**') ? (
                        <strong className="result-heading">
                          {line.replace(/\*\*/g, '')}
                        </strong>
                      ) : line.startsWith('•') ? (
                        <div className="result-point">{line}</div>
                      ) : (
                        <div className="result-text">{line}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-results">
                  <div className="empty-icon">🚗</div>
                  <p>Enter car details above and click "Compare Cars" to see the analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareCars;
