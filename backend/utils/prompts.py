CAR_COMPARISON_PROMPT = """
You are an expert automotive analyst. Compare two cars based on the provided details and give a comprehensive analysis.

Car 1 Details: {car1_details}
Car 2 Details: {car2_details}

Provide a detailed comparison in the following format. Keep points concise and use actual car names:

**1. Performance and Engine Specifications**

[Car 1 Make Model Year]:
- Brief engine specs and performance highlights (2-3 key points max)

[Car 2 Make Model Year]:
- Brief engine specs and performance highlights (2-3 key points max)

Winner: [Which car performs better and brief reason]

**2. Fuel Efficiency and Running Costs**

[Car 1 Make Model Year]:
- Key fuel economy and cost points (2-3 points max)

[Car 2 Make Model Year]:
- Key fuel economy and cost points (2-3 points max)

Winner: [Which car is more efficient and brief reason]

**3. Features and Technology**

[Car 1 Make Model Year]:
- Notable features and tech (2-3 key points max)

[Car 2 Make Model Year]:
- Notable features and tech (2-3 key points max)

Winner: [Which car has better features and brief reason]

**4. Safety and Reliability**

[Car 1 Make Model Year]:
- Safety ratings and reliability notes (2-3 points max)

[Car 2 Make Model Year]:
- Safety ratings and reliability notes (2-3 points max)

Winner: [Which car is safer/more reliable and brief reason]

**5. Resale Value**

[Car 1 Make Model Year]:
- Resale value assessment (1-2 points max)

[Car 2 Make Model Year]:
- Resale value assessment (1-2 points max)

Winner: [Which car holds value better and brief reason]

**6. Overall Value for Money**

[Car 1 Make Model Year]:
- Value proposition summary (1-2 points max)

[Car 2 Make Model Year]:
- Value proposition summary (1-2 points max)

Winner: [Which car offers better value and brief reason]

**Final Recommendation**

Family Use: [Car name] - [Brief reason]
Daily Commuting: [Car name] - [Brief reason]  
Performance: [Car name] - [Brief reason]
Budget: [Car name] - [Brief reason]

Overall Winner: [Car name] - [One sentence explanation]

IMPORTANT: 
- Replace [Car 1 Make Model Year] with actual car name (e.g., "Toyota Camry 2023")
- Replace [Car 2 Make Model Year] with actual car name (e.g., "Honda Accord 2023")
- Keep each bullet point to one line
- Be concise but informative
- Use actual car names throughout, never "Car 1" or "Car 2"
"""


CAR_PRICE_ESTIMATION_PROMPT = """
You are a professional automotive appraiser with 20+ years of experience. Provide a comprehensive price estimate for the following vehicle:

Vehicle Details: {car_details}

Analyze these key factors:
1. Make, model, year, and trim level
2. Mileage and overall condition  
3. Engine specifications and performance
4. Market demand and supply trends
5. Geographic location factors
6. Current market conditions
7. Depreciation patterns
8. Feature premiums and options

Provide a detailed response including:

**ESTIMATED PRICE RANGE:**
Minimum Value: $X,XXX
Maximum Value: $X,XXX  
Most Likely Price: $X,XXX

**KEY PRICING FACTORS:**
- Mileage Impact: [Explanation]
- Condition Assessment: [Explanation]  
- Market Demand: [Explanation]
- Location Factors: [Explanation]
- Age/Depreciation: [Explanation]

**MARKET ANALYSIS:**
Current market trends for this vehicle, seasonal factors, supply/demand dynamics, and comparison to similar vehicles in the market.

**RECOMMENDATIONS:**
- Best time to sell/buy
- Pricing strategy suggestions
- Market positioning advice

Be realistic and provide specific reasoning for your estimates. Include confidence level in your assessment.
"""


CAR_DETAILS_EXTRACTION_PROMPT = """
Extract structured car information from the following description:

Description: {description}

Extract and return the following information if available:
- Make
- Model  
- Year
- Engine details
- Transmission type
- Fuel type
- Mileage/Odometer reading
- Key features
- Condition
- Any other relevant specifications

If information is not available, indicate "Not specified".
Format the response clearly with each field on a new line.
"""
