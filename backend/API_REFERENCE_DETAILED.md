# Qedami API Documentation for Frontend Developers

**Version**: 1.1.0  
**Base URL**: `http://localhost:5000/api/v1` (Development)

---

## 🚀 Overview
This documentation provides a comprehensive guide to all available API endpoints in the Qedami backend. Every endpoint follows a consistent structure for success and error handling.

### 🛡 Standard Response Format

#### ✅ Success Response
Most endpoints return a JSON object with the following structure:
```json
{
  "success": true,
  "count": 10, // Optional: number of items in data
  "data": { ... } // Or [ ... ]
}
```

#### ❌ Error Response
In case of an error, the response will look like this:
```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## 📑 Table of Contents
1. [System Health](#1-system-health)
2. [Scout (Search & Discovery)](#2-scout-search--discovery)
3. [Services](#3-services)
4. [Offices & Locations](#4-offices--locations)
5. [Documents & Forms](#5-documents--forms)
6. [Geography & Proximity](#6-geography--proximity)

---

## 1. System Health

### `GET /health`
Check if the API is running correctly.

**Response**:
```json
{
  "status": "success",
  "message": "API is healthy"
}
```

---

## 2. Scout (Search & Discovery)

### `GET /scout/search`
Search for services or offices with filters.

**Query Parameters**:
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `q` | String | Search keyword for name |
| `category` | String | Category ID |
| `serviceType` | String | Type of service |
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Items per page (default: 10) |

**Example Response**:
```json
{
  "success": true,
  "count": 5,
  "data": {
    "services": [ ... ],
    "offices": [ ... ]
  }
}
```

### `GET /scout/suggestions`
Get autocomplete suggestions based on a query string.

**Query Parameters**:
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `q` | String | Partial string for autocomplete |

**Example Response**:
```json
[
  "Passport Renewal",
  "Central Passport Office"
]
```

### `GET /scout/categories`
Retrieve all available service categories.

### `GET /scout/services`
Browse all services (Scout view).

### `GET /scout/services/:id`
Get detailed information about a specific service (Scout view).

### `GET /scout/offices`
Browse all physical offices (Scout view).

### `GET /scout/offices/:id`
Get detailed information about a specific office (Scout view).

---

## 3. Services

### `GET /services`
List all services.

### `GET /services/:id`
Get full details of a specific service including related documents and offices.

### `POST /services`
Create a new service.

**Body (JSON)**:
```json
{
  "name": "Service Name",
  "description": "Description text",
  "category": "CATEGORY_ID",
  "serviceType": "Optional Type",
  "requirements": ["DOC_ID_1", "DOC_ID_2"],
  "checklist": [
    { "step": "Step 1", "description": "Do this first" }
  ],
  "offices": ["OFFICE_ID_1"],
  "forms": ["FORM_ID_1"],
  "availabilityNotes": "Optional notes"
}
```

### `PUT /services/:id`
Update an existing service.

### `DELETE /services/:id`
Delete a service.

### 🧩 Service Sub-Resources

- `GET /services/:id/documents`: Retrieve required documents.
- `GET /services/:id/checklist`: Retrieve step-by-step checklist.
- `GET /services/:id/forms`: Retrieve related forms.
- `GET /services/:id/offices`: List offices providing this service.
- `GET /services/:id/availability`: Get availability notes.

---

## 4. Offices & Locations

### `GET /offices`
List all physical offices.

### `GET /offices/:id`
Get specific office details.

### `POST /offices`
Create a new office.

**Body (JSON)**:
```json
{
  "name": "Office Name",
  "location": { "type": "Point", "coordinates": [lng, lat] },
  "address": "Physical Address",
  "hours": { "monday": { "open": "08:30", "close": "17:30" } },
  "contact": "Contact Info",
  "services": ["SERVICE_ID_1"]
}
```

### `PUT /offices/:id`
Update office information.

### `DELETE /offices/:id`
Delete an office.

### 🧩 Office Sub-Resources

- `GET /offices/:id/services`: List services offered by this office.
- `GET /offices/:id/hours`: Get office working hours.
- `GET /offices/:id/availability`: Get office real-time availability/status.
- `GET /offices/:id/documents`: List all documents required for services at this office.

---

## 5. Documents & Forms

### `GET /documents`
List all document types.

### `GET /documents/:id`
Get single document details.

### `POST /documents`
Register a new required document.

### `PUT /documents/:id`
Update document details.

### `DELETE /documents/:id`
Delete a document.

### `GET /forms`
List all downloadable application forms.

### `GET /forms/:id`
Get details for a specific form.

### `POST /forms`
Register a new form.

### `DELETE /forms/:id`
Delete a form.

---

## 6. Geography & Proximity

### `GET /geo/nearby`
Find offices closest to the user's location.

**Query Parameters (Required)**:
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `lat` | Number | Latitude |
| `lng` | Number | Longitude |
| `serviceId` | String | (Optional) Filter by service |

### `GET /geo/regions`
List all regions (cities).

### `GET /geo/regions/:id/offices`
List all offices within a specific region.

---

## 🛠 Data Schema Reference (For Frontend)

### Service Model
- `name`: String
- `description`: String
- `category`: ObjectID (Ref Category)
- `serviceType`: String
- `requirements`: [ObjectID] (Ref Document)
- `checklist`: [{ step: String, description: String }]
- `offices`: [ObjectID] (Ref Office)
- `forms`: [ObjectID] (Ref Form)
- `availabilityNotes`: String

### Office Model
- `name`: String
- `location`: GeoJSON Point `{ type: "Point", coordinates: [lng, lat] }`
- `address`: String
- `hours`: Object (monday-sunday with open/close keys)
- `contact`: String
- `services`: [ObjectID] (Ref Service)
