CAR_COMPARISON_PROMPT = """
You are an expert automotive analyst. Compare two cars based on the provided details and give a comprehensive analysis.

Car 1 Details: {car1_details}
Car 2 Details: {car2_details}

Provide a detailed comparison covering:
1. Performance and Engine Specifications
2. Fuel Efficiency and Running Costs
3. Features and Technology
4. Safety Ratings (if known)
5. Reliability and Maintenance
6. Resale Value
7. Overall Value for Money

Format your response as a structured analysis with clear sections and bullet points.
End with a clear recommendation based on different use cases (family, commuting, performance, etc.).
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
