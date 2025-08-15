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
You are a professional car appraiser with expertise in market valuation. Estimate the price of the following car:

Car Details: {car_details}

Consider these factors:
1. Make, model, and year
2. Mileage and condition
3. Engine specifications and features
4. Market demand and supply
5. Location-based pricing
6. Depreciation patterns
7. Current market trends

Provide:
1. Estimated price range (minimum and maximum)
2. Most likely selling price
3. Key factors affecting the price
4. Market analysis and trends
5. Tips for buyers/sellers

Be realistic and provide reasoning for your estimates.
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
