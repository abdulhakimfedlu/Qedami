# Qedami API Documentation (MVP)

**Version**: 1.0.0 (MVP)  
**Base URL**: `/api/v1`  
**Backend Stack**: Node.js, Express.js, MongoDB  

---

## 📑 Table of Contents
1. [System & Health](#1-system--health)
2. [Scout – Search & Discovery](#2-scout--search--discovery)
3. [Services](#3-services)
4. [Offices & Locations](#4-offices--locations)
5. [Documents & Forms](#5-documents--forms)
6. [Geography & Proximity](#6-geography--proximity)
7. [Critical Endpoints Summary](#7-mvp-critical-endpoints-summary)
8. [Data Models (Schemas)](#8-data-models-schemas)

---

## 1. System & Health
Endpoints to confirm API availability and system health.

### `GET /health`
Check API health status (used for monitoring and deployment validation).

---

## 2. Scout – Search & Discovery
The Scout module allows users to search, browse, and discover services and offices.

### 2.1 Search
#### `GET /scout/search`
Search for services or offices using keywords and filters.

**Query Parameters**:
| Parameter | Description |
| :--- | :--- |
| `q` | Search keyword (service name, office name, or related term) |
| `category` | Filter by service category |
| `location` | Filter by city/region name |
| `serviceType` | Filter by type of service |
| `openNow` | Boolean filter for currently open offices |
| `page` | Pagination page number |
| `limit` | Number of results per page |

**Example**: `GET /api/v1/scout/search?q=passport&location=addis`

#### `GET /scout/suggestions`
Returns autocomplete suggestions for search input.

### 2.2 Browse
#### `GET /scout/services`
Retrieve a list of all available services.

#### `GET /scout/services/:serviceId`
Get detailed information about a specific service.

#### `GET /scout/offices`
Retrieve a list of all offices.

#### `GET /scout/offices/:officeId`
Get detailed information about a specific office.

#### `GET /scout/categories`
Retrieve all service categories.

---

## 3. Services
Services represent government or organizational offerings.

### 3.1 Service CRUD (Read-Heavy for MVP)
- `GET /services`: List all services (supports filtering).
- `GET /services/:id`: Retrieve full details of a service.
- `POST /services`: Create a new service.
- `PUT /services/:id`: Update an existing service.
- `DELETE /services/:id`: Delete a service.

### 3.2 Service Sub-Resources
- `GET /services/:id/documents`: Retrieve required documents for a service.
- `GET /services/:id/checklist`: Retrieve document checklist for the service.
- `GET /services/:id/forms`: Retrieve related forms and external links.
- `GET /services/:id/offices`: Offices that provide this service.
- `GET /services/:id/availability`: General availability information (hours, capacity notes).

---

## 4. Offices & Locations
Offices represent physical or organizational locations.

### 4.1 Office CRUD
- `GET /offices`: List all offices.
- `GET /offices/:id`: Retrieve office details.
- `POST /offices`: Create a new office.
- `PUT /offices/:id`: Update office information.
- `DELETE /offices/:id`: Delete an office.

### 4.2 Office Sub-Resources
- `GET /offices/:id/services`: List services offered by this office.
- `GET /offices/:id/hours`: Office working hours.
- `GET /offices/:id/availability`: Office availability or queue information.
- `GET /offices/:id/documents`: Documents accepted or required at this office.

---

## 5. Documents & Forms
Requirements and downloadable resources needed to complete services.

### 5.1 Documents
- `GET /documents`: List all documents.
- `GET /documents/:id`: Retrieve document details.
- `POST /documents`: Create a new document entry.
- `PUT /documents/:id`: Update document details.
- `DELETE /documents/:id`: Delete a document.

### 5.2 Forms
- `GET /forms`: List all forms.
- `GET /forms/:id`: Retrieve form details and download link.
- `POST /forms`: Upload or register a new form.
- `DELETE /forms/:id`: Delete a form.

---

## 6. Geography & Proximity
Used to support location-aware discovery.

### `GET /geo/nearby`
Find nearest offices based on latitude and longitude.
**Query Example**: `GET /api/v1/geo/nearby?lat=9.03&lng=38.74&serviceId=123`

### `GET /geo/regions`
Retrieve all regions/cities.

### `GET /geo/regions/:id/offices`
Retrieve offices within a specific region.

---

## 7. MVP Critical Endpoints Summary
The following endpoints form the minimum required API surface for the Qedami MVP:
- `GET /scout/search`
- `GET /scout/services`
- `GET /scout/services/:serviceId`
- `GET /scout/offices`
- `GET /scout/offices/:officeId`
- `GET /services/:id/documents`
- `GET /services/:id/checklist`
- `GET /geo/nearby`
- `GET /scout/categories`

---

## 8. Data Models (Schemas)

### Service Schema
```json
{
  "name": "String",
  "category": "String",
  "description": "String",
  "requirements": ["ObjectId"],
  "offices": ["ObjectId"],
  "serviceType": "String"
}
```

### Office Schema
```json
{
  "name": "String",
  "location": {
    "type": "Point",
    "coordinates": ["Number"]
  },
  "address": "String",
  "hours": "Object",
  "contact": "String"
}
```
