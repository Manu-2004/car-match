# 🚗 CarMatch - AI-Powered Car Comparison & Price Estimation Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-blue.svg)](https://react.dev/)
[![LangChain](https://img.shields.io/badge/LangChain-AI%20Integration-orange.svg)](https://www.langchain.com/)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

CarMatch is a modern AI-powered web application that helps users make informed decisions about cars through intelligent comparison and accurate price estimation.

---

## Overview

CarMatch offers two main features: **Car Comparison** 🔍 and **Price Estimation** 💵.  
Users can enter detailed vehicle specifications and receive GPT-4 powered insights to compare vehicles or get market-based price estimates.

---

## Features

### Car Comparison
- **Structured Input Forms**: Enter make, model, year, engine, transmission, fuel type, mileage, features, and condition.
- **AI-Powered Analysis**: Compare cars across performance, fuel efficiency, features, safety, reliability, and value.
- **Winner Highlighting**: Color-coded indicators for category winners.
- **Use Case Recommendations**: Suggestions for family use, commuting, performance driving, and budget options.

### Price Estimation
- **Market Analysis**: Estimates prices based on condition, mileage, location, and trends.
- **Multi-Currency Support**: Detects location and supports USD, EUR, GBP, INR, CAD, AUD, and JPY.
- **Flexible Mileage Input**: Accepts miles or kilometers.
- **Detailed Breakdown**: Covers trends, depreciation, location impact, and condition effects.
- **Key Pricing Factors**: Explains main factors influencing valuation.

---

## Technology Stack

### Backend
- **FastAPI (Python)**
- **LangChain + OpenAI GPT-4**
- **Pydantic** for validation
- **CORS** for frontend integration

### Frontend
- **React (with hooks)**
- **Custom CSS + Responsive Design**
- **Dark Theme** with gradients & animations
- **React useState** for state management
- **Fetch API** for backend communication

---

## Architecture

**Frontend (React)** ↔ **Backend (FastAPI)** ↔ **LangChain + GPT-4**  

**Backend Structure**
- Routes: API endpoints for comparison & estimation
- Services: Business logic
- Models: Pydantic schemas
- Utils: Prompt templates & helpers

**Frontend Structure**
- Components: Forms, results, UI widgets
- Pages: Comparison & estimation
- Styling: Responsive CSS

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/compare/` | Compare two cars |
| POST   | `/api/price/estimate` | Estimate car price |
| GET    | `/api/compare/health` | Health check (comparison) |
| GET    | `/api/price/health` | Health check (price estimation) |

---

## User Experience

CarMatch ensures:
- Structured, easy-to-use forms
- Real-time validation
- Visual result cards
- Color-coded category winners
- Responsive design for all devices
