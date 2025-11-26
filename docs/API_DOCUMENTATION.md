# Sales Dashboard API Documentation

## Overview

The Sales Funnel Dashboard provides structured data through a JSON API endpoint. This document describes the data structure, endpoints, and usage patterns.

## Base Data Structure

```json
{
  "metadata": {
    "report_name": "string",
    "generated_at": "ISO 8601 timestamp",
    "total_sheets": "number"
  },
  "sheets": {
    "proposal_submitted": { ... },
    "demos": { ... },
    "client_direct_visit": { ... },
    "dc_visit": { ... }
  },
  "kpis": { ... }
}
```

## Endpoints

### 1. Get Dashboard Summary

**Request:**
```
GET /api/dashboard/summary
```

**Response:**
```json
{
  "total_proposals": 2,
  "total_demos": 2,
  "total_visits": 4,
  "total_dc_visits": 2,
  "pipeline_value": 1.10,
  "expected_revenue": 0.33
}
```

### 2. Get Proposals

**Request:**
```
GET /api/proposals
```

**Query Parameters:**
- `sort_by`: field name (default: date)
- `order`: asc|desc (default: desc)
- `limit`: number of records (default: 100)
- `offset`: pagination offset (default: 0)

**Response:**
```json
{
  "total_records": 2,
  "data": [
    {
      "sr_no": 1,
      "date": "2025-07-04",
      "pot_id": "POT001",
      "client_name": "Redfox Security",
      "tcv": 1.08,
      "probability": 60,
      "sales_stage": "L3",
      "status": "NO Go"
    }
  ]
}
```

### 3. Get Client Visits

**Request:**
```
GET /api/visits
```

**Response:**
```json
{
  "total_records": 4,
  "by_region": {
    "Mumbai": 4,
    "Bangalore": 0
  },
  "data": [ ... ]
}
```

### 4. Get Demos

**Request:**
```
GET /api/demos
```

**Response:**
```json
{
  "total_records": 2,
  "conversion_rate": 100,
  "data": [ ... ]
}
```

### 5. Get Regional Analysis

**Request:**
```
GET /api/analytics/regional
```

**Response:**
```json
{
  "Mumbai": {
    "visits": 4,
    "proposals": 1,
    "revenue": 0.55
  },
  "Bangalore": {
    "visits": 0,
    "proposals": 1,
    "revenue": 0.55
  }
}
```

### 6. Get Industry Analysis

**Request:**
```
GET /api/analytics/industry
```

**Response:**
```json
{
  "BFSI": {
    "count": 1,
    "revenue": 0.55,
    "percentage": 50
  },
  "IT": {
    "count": 1,
    "revenue": 0.55,
    "percentage": 50
  }
}
```

### 7. Get KPIs

**Request:**
```
GET /api/kpis
```

**Response:**
```json
{
  "total_proposals": 2,
  "total_demos": 2,
  "total_visits": 4,
  "total_activities": 10,
  "revenue_metrics": {
    "total_tcv": 1.10,
    "avg_acv": 0.52,
    "avg_probability": 60
  }
}
```

## Data Models

### Proposal

```typescript
{
  sr_no: number,
  date: string (YYYY-MM-DD),
  pot_id: string,
  source: string,
  sales_person: string,
  client_name: string,
  opportunity_name: string,
  mrr: number,
  acv: number,
  otc: number,
  tcv: number,
  sales_stage: string (L1-L5),
  probability: number (0-100),
  sales_type: string,
  industry: string,
  region: string,
  remark: string,
  latest_remark: string
}
```

### Demo

```typescript
{
  sr_no: number,
  sales_person: string,
  client_name: string,
  contact_no: string,
  email: string
}
```

### Client Visit

```typescript
{
  sr_no: number,
  date: string (YYYY-MM-DD),
  sales_person: string,
  client_name: string,
  products_pitched: string,
  industry: string,
  region: string
}
```

### DC Visit

```typescript
{
  sr_no: number,
  date: string (YYYY-MM-DD),
  sales_person: string,
  account_name: string,
  product_pitched: string,
  sector: string,
  region: string,
  contact_person: string,
  mobile: string
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid parameter",
  "message": "sort_by parameter must be a valid field",
  "status": 400
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "message": "Proposal with ID POT999 not found",
  "status": 404
}
```

### 500 Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to process request",
  "status": 500
}
```

## Rate Limiting

- **Limit:** 1000 requests per hour
- **Headers:** 
  - `X-RateLimit-Limit: 1000`
  - `X-RateLimit-Remaining: 999`
  - `X-RateLimit-Reset: 1234567890`

## Authentication

Currently, the API is public. For production, implement:

```javascript
// Add bearer token
headers: {
  'Authorization': 'Bearer YOUR_API_KEY'
}
```

## Example Requests

### JavaScript/Node.js

```javascript
// Fetch proposals
fetch('/api/proposals?sort_by=date&order=desc')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Fetch with filters
fetch('/api/proposals?limit=10&offset=0')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Python

```python
import requests

# Get dashboard summary
response = requests.get('/api/dashboard/summary')
data = response.json()
print(data)

# Get proposals with pagination
response = requests.get('/api/proposals', params={
    'sort_by': 'tcv',
    'order': 'desc',
    'limit': 20
})
proposals = response.json()
```

### cURL

```bash
# Get KPIs
curl -X GET "http://localhost:3000/api/kpis"

# Get proposals
curl -X GET "http://localhost:3000/api/proposals?sort_by=date&order=desc"

# Get regional analysis
curl -X GET "http://localhost:3000/api/analytics/regional"
```

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful, no response body |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Server Error - Internal error |
| 503 | Service Unavailable - Maintenance |

## Pagination

Use `limit` and `offset` parameters:

```
GET /api/proposals?limit=20&offset=0
GET /api/proposals?limit=20&offset=20
GET /api/proposals?limit=20&offset=40
```

Response includes:
```json
{
  "total_records": 100,
  "limit": 20,
  "offset": 0,
  "has_more": true,
  "data": [ ... ]
}
```

## Filtering

### By Date Range
```
GET /api/proposals?start_date=2025-07-01&end_date=2025-09-30
```

### By Region
```
GET /api/visits?region=Mumbai
```

### By Industry
```
GET /api/proposals?industry=BFSI
```

### By Probability
```
GET /api/proposals?min_probability=50&max_probability=100
```

## Sorting

**Supported fields:**
- date
- tcv
- probability
- client_name
- sales_person
- stage

**Example:**
```
GET /api/proposals?sort_by=tcv&order=desc
```

## Caching

Responses include cache headers:

```
Cache-Control: public, max-age=3600
ETag: "abc123"
Last-Modified: Mon, 25 Nov 2025 06:56:00 GMT
```

## WebSocket Events (Real-time)

```javascript
const ws = new WebSocket('ws://localhost:3000/api/live');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Data updated:', data);
};

ws.send(JSON.stringify({
  event: 'subscribe',
  channels: ['proposals', 'kpis']
}));
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-25 | Initial API release |

## Support

For API issues:
1. Check `INSTALLATION.md`
2. Review `Implementation_Guide.md`
3. See error responses above
4. Contact support team

---

**API Status:** ✅ Ready for Production
**Last Updated:** 2025-11-25
**Maintenance:** Ongoing
