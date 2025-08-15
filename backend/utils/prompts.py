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
You are a professional automotive appraiser with 20+ years of international experience. Provide a comprehensive price estimate for the following vehicle:

Vehicle Details: {car_details}

IMPORTANT: 
1. Determine the appropriate currency based on the location provided. Use USD as default if location is unclear.
2. Use the EXACT currency symbols as specified below - DO NOT use generic $ for all countries.
3. Provide EXACT minimum and maximum price values for easy parsing.

Analyze these key factors and provide a detailed response in this EXACT format:

**ESTIMATED PRICE RANGE:**
Minimum Value: [Exact Currency Symbol][Exact Amount]
Maximum Value: [Exact Currency Symbol][Exact Amount]

**MARKET TRENDS ANALYSIS:**
• Current market demand for this model
• Seasonal pricing factors  
• Supply availability in local market

**DEMAND AND SUPPLY FACTORS:**
• Market competition analysis
• Regional availability impact
• Buyer demand trends

**DEPRECIATION ASSESSMENT:**
• Age-related value impact
• Mileage depreciation effect
• Future value projection

**LOCATION AND CURRENCY FACTORS:**
• Local market pricing patterns
• Regional economic factors
• Currency-specific considerations

**CONDITION AND FEATURE IMPACT:**
• Vehicle condition assessment
• Feature premium analysis
• Maintenance history effect

**KEY PRICING FACTORS:**
- Mileage Impact: [1-2 sentence explanation]
- Condition Assessment: [1-2 sentence explanation]
- Market Demand: [1-2 sentence explanation]
- Location Factors: [1-2 sentence explanation]
- Age/Depreciation: [1-2 sentence explanation]
- Features Premium: [1-2 sentence explanation]

**RECOMMENDATIONS:**
• Best time to sell/buy
• Optimal pricing strategy
• Negotiation tips

MANDATORY Currency Usage by Location:
- Canada/Canadian locations: Use C$ (example: C$25,000)
- Australia/Australian locations: Use A$ (example: A$35,000)
- USA/United States: Use $ (example: $25,000)
- Europe/European locations: Use € (example: €20,000)
- UK/United Kingdom: Use £ (example: £18,000)
- India/Indian locations: Use ₹ (example: ₹2,500,000)
- Japan/Japanese locations: Use ¥ (example: ¥3,000,000)

CRITICAL REQUIREMENTS:
- NEVER use generic $ for Canada or Australia
- Use exact numeric values (e.g., C$25,000 not C$25K)
- Always include the correct currency symbol for the location
- Provide realistic price ranges (10-20% difference between min/max)
- Keep all bullet points concise (1-2 sentences max)
"""




CAR_DETAILS_EXTRACTION_PROMPT = """
Extract structured car information from the following description:

Description: {description}

Extract and return the following information if available:
- Make
- Model  
- Year
- Engine details
- Location
- Transmission type
- Fuel type
- Mileage/Odometer reading
- Key features
- Condition
- Any other relevant specifications

If information is not available, indicate "Not specified".
Format the response clearly with each field on a new line.
"""
