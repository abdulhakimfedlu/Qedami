# Qedami Backend (MVP)

Welcome to the **Qedami** Backend repository. This system provides the API for the Qedami Scout feature, facilitating the discovery of government and organizational services and offices in Ethiopia.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **API Style**: RESTful JSON

## 📂 Project Structure

```text
backend/
├── config/         # Database and environment configurations
├── controllers/    # Request handlers & transformation logic
├── models/         # Mongoose schemas (Service, Office, etc.)
├── routes/         # Express route definitions
├── server.js       # Entry point
└── README.md       # Project overview
```

## 🛠️ Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Qedami/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/qedami
   NODE_ENV=development
   ```

4. **Run the server**:
   ```bash
   npm start
   ```

## 📖 API Documentation

The full API specification, including request/response examples and data models, can be found in:

👉 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

## 🎯 Core MVP Features

- **Scout Search**: Find services and offices using keywords and geolocation.
- **Service Discovery**: Browse available services, requirements, and checklists.
- **Office Locator**: Find physical locations and contact details.
- **Proximity Search**: Identify the nearest offices based on GPS coordinates.
