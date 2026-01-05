# Software Interface Agreement

## Purpose

This document defines the interface between the User Interface team and the Backend Server team. It describes all available API endpoints, their request/response formats, and expected behavior.

## Overview

The backend server provides routing services for Singapore using OpenStreetMap data. The server is hosted on Google Cloud Run and may require a cold start before being ready to handle requests.

## Base URLs

- **Routing Service**: `https://routing-web-service-ityenzhnyq-an.a.run.app`
- **Bus Routing Service**: `https://nyc-bus-routing-k3q4yvzczq-an.a.run.app`

## API Endpoints

### 1. Server Readiness Check

**Purpose**: Check if the server is ready to handle requests. The server requires a cold start and this endpoint should be polled until it returns "ready".

**Endpoint**: `GET /ready`

**Base URL**: Routing Service

**Request**:
```
GET https://routing-web-service-ityenzhnyq-an.a.run.app/ready
```

**Response**:
- Status Code: `200 OK`
- Content-Type: `text/plain`
- Body: `"wait"` or `"ready"`

**Example Response**:
```
ready
```

**Error Handling**: If the server is down, the request will timeout or return an error.

**Usage Notes**:
- Poll this endpoint every few seconds until "ready" is returned
- Other API endpoints may fail if called before the server is ready

---

### 2. Get All Available Road Types

**Purpose**: Retrieve a list of all road types available in the system.

**Endpoint**: `GET /allAxisTypes`

**Base URL**: Bus Routing Service

**Request**:
```
GET https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/allAxisTypes
```

**Response**:
- Status Code: `200 OK`
- Content-Type: `application/json`
- Body: JSON array of strings

**Example Response**:
```json
[
  "motorway",
  "primary",
  "secondary",
  "tertiary",
  "trunk",
  "residential",
  "cycleway",
  "footway",
  "path",
  "motorway_link",
  "primary_link",
  "secondary_link",
  "tertiary_link",
  "trunk_link"
]
```

**Error Handling**: Returns error if server is unavailable.

---

### 3. Get Valid Road Types

**Purpose**: Retrieve the list of road types currently used by the routing algorithm.

**Endpoint**: `GET /validAxisTypes`

**Base URL**: Routing Service

**Request**:
```
GET https://routing-web-service-ityenzhnyq-an.a.run.app/validAxisTypes
```

**Response**:
- Status Code: `200 OK`
- Content-Type: `application/json`
- Body: JSON array of strings

**Example Response**:
```json
[
  "tertiary_link",
  "tertiary",
  "secondary_link",
  "primary_link",
  "primary",
  "motorway_link",
  "secondary",
  "motorway"
]
```

**Error Handling**: Returns error if server is unavailable.

---

### 4. Get Road Type GeoJSON

**Purpose**: Retrieve GeoJSON data for all roads of a specific type.

**Endpoint**: `GET /axisType/{roadType}`

**Base URL**: Routing Service

**Path Parameters**:
- `roadType` (string, required): The road type identifier (e.g., "motorway", "primary", "secondary")

**Request**:
```
GET https://routing-web-service-ityenzhnyq-an.a.run.app/axisType/motorway
```

**Response**:
- Status Code: `200 OK`
- Content-Type: `application/json`
- Body: GeoJSON FeatureCollection

**Example Response**:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [103.8198, 1.3521],
          [103.8200, 1.3522]
        ]
      },
      "properties": {
        "name": "East Coast Parkway",
        "type": "motorway"
      }
    }
  ]
}
```

**Error Handling**: 
- Returns 404 if road type doesn't exist
- Returns error if server is unavailable

**Usage Notes**:
- Use an online GeoJSON viewer to visualize the response
- Coordinates are in [longitude, latitude] format

---

### 5. Change Valid Road Types (Optional)

**Purpose**: Update the road types used by the routing algorithm. This allows filtering routes by travel mode (car, bicycle, etc.).

**Endpoint**: `POST /changeValidRoadTypes`

**Base URL**: Bus Routing Service

**Request**:
```
POST https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/changeValidRoadTypes
Content-Type: application/json
```

**Request Body**: JSON array of road type strings
```json
[
  "primary",
  "secondary",
  "tertiary",
  "trunk",
  "primary_link",
  "secondary_link",
  "tertiary_link",
  "trunk_link"
]
```

**Response**:
- Status Code: `200 OK`
- Content-Type: `application/json`
- Body: JSON array of road types (confirmation of updated list)

**Example Response**:
```json
[
  "primary",
  "secondary",
  "tertiary",
  "trunk",
  "primary_link",
  "secondary_link",
  "tertiary_link",
  "trunk_link"
]
```

**Error Handling**: Returns error if invalid road types are provided or server is unavailable.

**Usage Notes**:
- This affects all subsequent route calculations
- Should be called when user changes travel mode
- Example: For bicycle mode, only include "cycleway" and "residential"

---

### 6. Get Route

**Purpose**: Calculate the shortest route between a start point and end point.

**Endpoint**: `POST /route`

**Base URL**: Routing Service

**Request**:
```
POST https://routing-web-service-ityenzhnyq-an.a.run.app/route
Content-Type: application/json
```

**Request Body**: JSON object with start and end points
```json
{
  "startPt": {
    "long": 103.93443316267717,
    "lat": 1.323996524195518,
    "description": "Bedok 85"
  },
  "endPt": {
    "long": 103.75741069280338,
    "lat": 1.3783396904609801,
    "description": "Choa Chu Kang Road"
  }
}
```

**Request Body Fields**:
- `startPt` (object, required):
  - `long` (number, required): Longitude of start point
  - `lat` (number, required): Latitude of start point
  - `description` (string, optional): Human-readable description
- `endPt` (object, required):
  - `long` (number, required): Longitude of end point
  - `lat` (number, required): Latitude of end point
  - `description` (string, optional): Human-readable description

**Response**:
- Status Code: `200 OK`
- Content-Type: `application/json`
- Body: GeoJSON FeatureCollection with route line(s)

**Example Response**:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [103.93443316267717, 1.323996524195518],
          [103.9350, 1.3240],
          [103.75741069280338, 1.3783396904609801]
        ]
      },
      "properties": {
        "distance": 25000,
        "duration": 1800
      }
    }
  ]
}
```

**Error Handling**: 
- Returns error if route cannot be calculated (e.g., no valid path exists)
- Returns error if coordinates are outside Singapore
- Returns error if server is unavailable

**Usage Notes**:
- Coordinates must be within Singapore boundaries
- Route uses only the currently set valid road types
- Use an online GeoJSON viewer to visualize the response

---

### 7. Get All Blockages

**Purpose**: Retrieve all active blockages from the server.

**Endpoint**: `GET /blockage`

**Base URL**: Routing Service

**Request**:
```
GET https://routing-web-service-ityenzhnyq-an.a.run.app/blockage
```

**Response**:
- Status Code: `200 OK`
- Content-Type: `application/json`
- Body: GeoJSON FeatureCollection

**Example Response**:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [103.93443316267717, 1.323996524195518]
      },
      "properties": {
        "name": "testing blockage 1",
        "description": "description 1",
        "radius": 200
      }
    }
  ]
}
```

**Error Handling**: Returns error if server is unavailable.

**Usage Notes**:
- Blockages are circular areas that affect routing
- Radius is in meters
- Coordinates are in [longitude, latitude] format

---

### 8. Add Blockage

**Purpose**: Add a new blockage to the server.

**Endpoint**: `POST /blockage`

**Base URL**: Routing Service

**Request**:
```
POST https://routing-web-service-ityenzhnyq-an.a.run.app/blockage
Content-Type: application/json
```

**Request Body**: JSON object with blockage details
```json
{
  "point": {
    "long": 103.93443316267717,
    "lat": 1.323996524195518
  },
  "radius": 200,
  "name": "testing blockage 1",
  "description": "description 1"
}
```

**Request Body Fields**:
- `point` (object, required):
  - `long` (number, required): Longitude of blockage center
  - `lat` (number, required): Latitude of blockage center
- `radius` (number, required): Radius of blockage in meters
- `name` (string, required): Unique identifier for the blockage
- `description` (string, required): Human-readable description

**Response**:
- Status Code: `200 OK` or `201 Created`
- Content-Type: `application/json`
- Body: Confirmation message or blockage data

**Error Handling**: 
- Returns error if blockage name already exists
- Returns error if coordinates are invalid
- Returns error if server is unavailable

**Usage Notes**:
- Blockage name must be unique
- Radius is specified in meters
- Blockages affect route calculations

---

### 9. Delete Blockage

**Purpose**: Remove an existing blockage from the server.

**Endpoint**: `DELETE /blockage/{blockageName}`

**Base URL**: Routing Service

**Path Parameters**:
- `blockageName` (string, required): The name of the blockage to delete

**Request**:
```
DELETE https://routing-web-service-ityenzhnyq-an.a.run.app/blockage/testing%20blockage%201
```

**Note**: The blockage name should be URL-encoded in the path.

**Response**:
- Status Code: `200 OK` or `204 No Content`
- Body: Empty or confirmation message

**Error Handling**: 
- Returns 404 if blockage doesn't exist
- Returns error if server is unavailable

**Usage Notes**:
- Blockage name must match exactly (case-sensitive)
- Use URL encoding for special characters in blockage names

---

## Data Formats

### GeoJSON

The server uses the GeoJSON format (RFC 7946) for spatial data. Key points:

- **Coordinates**: Always in [longitude, latitude] format (note: longitude first, then latitude)
- **FeatureCollection**: Used for collections of features (routes, road types, blockages)
- **LineString**: Used for route paths and road segments
- **Point**: Used for blockage centers

### Coordinate System

- **Longitude**: -180 to 180 (Singapore is around 103.8)
- **Latitude**: -90 to 90 (Singapore is around 1.35)
- **Format**: Decimal degrees (e.g., 103.93443316267717, 1.323996524195518)

---

## Error Handling

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Server not ready

### Error Response Format

Error responses typically include:
- HTTP status code
- Error message in response body (format may vary)

---

## Rate Limiting

No rate limiting information provided by backend team. Assume reasonable usage patterns.

---

## Authentication

No authentication required for any endpoints.

---

## CORS

The backend server should support CORS for web applications. If CORS issues occur, contact the backend team.

---

## Testing Recommendations

1. Use Postman to test all endpoints before implementation
2. Test server readiness before calling other endpoints
3. Use online GeoJSON viewers to visualize responses
4. Test edge cases (invalid coordinates, missing parameters, etc.)
5. Test with different travel modes and road type combinations

---

## External Tools

- **Postman**: API testing tool (https://www.postman.com/)
- **GeoJSON Viewer**: http://geojson.io/
- **GeoJSON Tools**: Various online tools available for viewing GeoJSON data

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-XX | Initial version |

---

## Contact

For questions or issues regarding these APIs, contact the Backend Server team.

