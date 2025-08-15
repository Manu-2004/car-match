# CarMatch - AI-Powered Car Comparison and Price Estimation Platform

![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green.svg)
![React](https://img.shields.io/badge/React-Frontend-blue.svg)
![LangChain](https://img.shields.io/badge/LangChain-AI%20Integration-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

CarMatch is a comprehensive web application that leverages artificial intelligence to help users make informed decisions about cars through intelligent comparison and accurate price estimation.

---

## Overview

CarMatch provides two core functionalities: **car comparison** and **price estimation**.  
Users can input detailed vehicle specifications and receive AI-powered analysis to compare multiple vehicles or get market-based price estimates for their cars.

---

## Features

### Car Comparison
- **Structured Input Forms**: Enter car details like make, model, year, engine, transmission, fuel type, mileage, features, and condition.
- **AI-Powered Analysis**: Uses GPT-4 to compare cars across performance, fuel efficiency, features, safety, reliability, and value for money.
- **Winner Highlighting**: Color-coded indicators showing which car excels in each category.
- **Use Case Recommendations**: Tailored advice for family use, commuting, performance driving, and budget considerations.

### Price Estimation
- **Market Analysis**: Estimates prices based on vehicle condition, mileage, location, and market trends.
- **Multi-Currency Support**: Detects location and displays prices in USD, EUR, GBP, INR, CAD, AUD, or JPY.
- **Flexible Mileage Input**: Supports miles and kilometers.
- **Detailed Breakdown**: Covers trends, supply-demand factors, depreciation, location influence, and condition impact.
- **Key Pricing Factors**: Explains main variables affecting valuation.

---

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **AI Integration**: LangChain with OpenAI GPT-4
- **Validation**: Pydantic models
- **CORS Support**: Enabled for frontend communication

### Frontend
- **Framework**: React (with hooks)
- **Styling**: Custom CSS, responsive design
- **Theme**: Modern dark theme with gradients and animations
- **State Management**: React `useState`
- **API Communication**: Fetch API

### Key Technologies
- **LangChain** – AI prompt management and processing
- **OpenAI GPT-4** – AI-powered analysis
- **FastAPI** – High-performance backend API framework
- **React** – Component-based UI
- **Pydantic** – Data validation

---

## Architecture

The app has a **React frontend** and a **FastAPI backend**.  
The backend integrates with GPT-4 via LangChain for intelligent processing.

**Backend Structure**
- Routes: Endpoints for comparison & price estimation
- Services: Business logic
- Models: Pydantic schemas
- Utils: Prompt templates, helpers

**Frontend Structure**
- Components: Forms, results, UI elements
- Pages: Comparison and price estimation
- Styling: Responsive CSS

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/compare/` | Compare two cars |
| POST   | `/api/price/estimate` | Estimate car price |
| GET    | `/api/compare/health` | Check comparison service health |
| GET    | `/api/price/health` | Check price estimation service health |

---

## User Experience

CarMatch ensures:
- Structured, easy-to-use forms
- Real-time validation
- Visual result cards
- Color coding for category winners
- Responsive design for all devices

---

## License
This project is licensed under the MIT License.
