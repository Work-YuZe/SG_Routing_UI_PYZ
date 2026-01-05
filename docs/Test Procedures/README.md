# Test Procedures

This document describes the testing procedures for the Singapore Routing App UI.

## Overview

This document provides step-by-step test procedures for validating all functionalities of the Singapore Routing App UI. Each test includes preconditions, test steps, expected results, and post-conditions.

## Test Environment Setup

### Prerequisites

1. Node.js 18+ installed
2. npm or yarn package manager
3. Modern web browser (Chrome, Firefox, Safari, or Edge)
4. Backend server should be accessible (may require cold start)
5. Stable internet connection

### Installation Steps

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open browser to `http://localhost:3000`

### External Tools Used

- **Postman**: For API testing and exploration
  - Download: https://www.postman.com/
  - Used to verify backend API endpoints before UI implementation
- **GeoJSON.io**: For visualizing GeoJSON responses
  - URL: http://geojson.io/
  - Used to verify route and road type GeoJSON data
- **Browser DevTools**: For debugging and network monitoring

---

## Test Case 1: Server Status Check

**Test ID**: TC-001  
**Priority**: High  
**Related User Story**: US-001

### Preconditions

- Application is loaded in browser
- Backend server URL is accessible

### Test Steps

1. Open the application in browser
2. Observe the server status indicator (bottom right corner)
3. Wait for status to update
4. Verify status color and text

### Expected Results

- Server status indicator is visible on the map
- Status shows "Server Ready" (green) when server is available
- Status shows "Server Starting..." (orange) when server is initializing
- Status shows "Server Error" (red) when server is unavailable
- Status updates automatically every 5 seconds

### Post-Conditions

- Status indicator continues to update periodically

### Screenshots

*Include screenshot of server status indicator showing "Server Ready"*

---

## Test Case 2: Setting Start and End Points

**Test ID**: TC-002  
**Priority**: High  
**Related User Story**: US-002

### Preconditions

- Application is loaded
- Server is ready
- Map is visible

### Test Steps

1. Click anywhere on the map to set start point
2. Observe the route planner panel (top left)
3. Verify start point marker appears on map
4. Click on a different location on the map to set end point
5. Observe the route planner panel
6. Verify end point marker appears

### Expected Results

- Start point marker appears at first clicked location
- Route planner panel shows coordinates of start point
- Coordinates are displayed with 6 decimal places
- User can enter description for start point
- "Clear Start" button is available
- End point marker appears at second clicked location (different from start marker)
- Route planner panel shows coordinates of end point
- User can enter description for end point
- "Clear End" button is available
- "Calculate Route" button becomes enabled when both points are set

### Post-Conditions

- Both start and end points are set and visible on map
- Route can be calculated

### Test Data

- Start point coordinate: Latitude 1.323996, Longitude 103.934433 (Bedok area)
- End point coordinate: Latitude 1.378339, Longitude 103.757410 (Choa Chu Kang area)

---

## Test Case 3: Calculate Route

**Test ID**: TC-003  
**Priority**: High  
**Related User Story**: US-003

### Preconditions

- Application is loaded
- Server is ready
- Start and end points are set (TC-002)

### Test Steps

1. Enter optional descriptions for start and end points
2. Click "Calculate Route" button
3. Wait for route calculation
4. Observe the map

### Expected Results

- "Calculate Route" button shows "Calculating..." during request
- Route line appears on map connecting start and end points
- Route line is blue and clearly visible
- Map automatically adjusts to show entire route
- Start and end markers remain visible
- Route follows appropriate roads

### Post-Conditions

- Route is displayed on map
- Route can be cleared by clearing points

### Test Data

- Start: Bedok (1.323996, 103.934433)
- End: Choa Chu Kang (1.378339, 103.757410)

### Screenshots

*Include screenshot showing calculated route on map*

---

## Test Case 4: View Road Type - Motorway

**Test ID**: TC-004  
**Priority**: Medium  
**Related User Story**: US-004

### Preconditions

- Application is loaded
- Server is ready
- Road Type Viewer panel is visible

### Test Steps

1. Click "Show" button in Road Type Viewer panel
2. Wait for road types list to load
3. Click on "motorway" road type
4. Observe the map

### Expected Results

- Road types list appears
- "motorway" button becomes highlighted
- Motorway roads are displayed on map
- Roads are shown with blue color and appropriate styling
- Map may adjust bounds to show motorways
- Route calculation is not affected

### Post-Conditions

- Motorway visualization is active
- Can clear selection or select different road type

---

## Test Case 5: View All Blockages

**Test ID**: TC-005  
**Priority**: Medium  
**Related User Story**: US-005

### Preconditions

- Application is loaded
- Server is ready

### Test Steps

1. Observe the Blockage Manager panel (bottom left)
2. Check the "Existing Blockages" list
3. Observe the map for blockage visualizations

### Expected Results

- Blockage Manager panel shows list of all blockages
- Each blockage shows name, description, and radius
- Blockages are displayed on map as red circular areas
- Blockage count is displayed

### Post-Conditions

- All blockages are visible and can be managed

---

## Test Case 6: Add Blockage

**Test ID**: TC-006  
**Priority**: Medium  
**Related User Story**: US-006

### Preconditions

- Application is loaded
- Server is ready

### Test Steps

1. Click "Add Blockage" button in Blockage Manager
2. Click on map to select blockage location (form should be open)
4. Enter blockage name (e.g., "Test Blockage 1")
5. Enter radius (e.g., 200)
6. Enter description (optional, e.g., "Construction work")
7. Click "Add Blockage" button

### Expected Results

- Blockage form appears in Blockage Manager
- Clicking map sets location for blockage
- Location coordinates are displayed
- Blockage is added to server successfully
- New blockage appears in the list
- New blockage appears on map as red circle
- Form clears after successful addition
- Panel closes automatically

### Post-Conditions

- New blockage is active and affects route calculations

### Test Data

- Name: "Test Blockage 1"
- Radius: 200 meters
- Description: "Construction work"
- Location: Any point in Singapore

---

## Test Case 7: Delete Blockage

**Test ID**: TC-007  
**Priority**: Medium  
**Related User Story**: US-007

### Preconditions

- At least one blockage exists (can use TC-006)

### Test Steps

1. Find a blockage in the Blockage Manager list
2. Click "Delete" button for that blockage
3. Observe the blockage list and map

### Expected Results

- Blockage is removed from server
- Blockage disappears from the list
- Blockage visualization disappears from map
- Blockage count updates

### Post-Conditions

- Blockage is permanently deleted

---

## Test Case 8: Route Avoids Blockages

**Test ID**: TC-008  
**Priority**: High  
**Related User Story**: US-005, US-003

### Preconditions

- At least one blockage exists and is visible on map
- Start and end points are set
- Blockage is between start and end points

### Test Steps

1. Set start point
2. Set end point (with blockage in between)
3. Calculate route
4. Observe if route avoids blockage

### Expected Results

- Calculated route avoids blocked areas
- Route takes alternative path around blockage

### Post-Conditions

- Route respects blockages

---

## Test Results Template

| Test ID | Test Case | Status | Notes | Screenshot |
|---------|-----------|--------|-------|------------|
| TC-001 | Server Status Check | ✅ Pass / ❌ Fail | | |
| TC-002 | Setting Start and End Points | ✅ Pass / ❌ Fail | | |
| TC-003 | Calculate Route | ✅ Pass / ❌ Fail | | |
| TC-004 | View Road Type - Motorway | ✅ Pass / ❌ Fail | | |
| TC-005 | View All Blockages | ✅ Pass / ❌ Fail | | |
| TC-006 | Add Blockage | ✅ Pass / ❌ Fail | | |
| TC-007 | Delete Blockage | ✅ Pass / ❌ Fail | | |
| TC-008 | Route Avoids Blockages | ✅ Pass / ❌ Fail | | |

---

## Automated Testing

While manual testing is described above, consider implementing automated tests using:

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress** or **Playwright**: End-to-end testing

---

## Performance Testing

### Load Time

- Application should load within 3 seconds
- Map tiles should load progressively without blocking

### Route Calculation

- Route calculation should complete within 30 seconds for typical routes
- Loading indicator should be shown during calculation

### Map Performance

- Map should maintain 60fps during pan and zoom operations
- Road type visualization should not cause significant lag

---

## Browser Compatibility Testing

Test on following browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Mobile Responsiveness

While desktop-focused, test basic mobile responsiveness:

- Map should be usable on tablets
- UI panels should be accessible (may need responsive design improvements)

---

## Test Execution Log

| Date | Tester | Test Cases Executed | Pass Rate | Notes |
|------|--------|---------------------|-----------|-------|
| YYYY-MM-DD | Name | TC-001 to TC-008 | XX% | |

---

## Known Issues

List any known issues discovered during testing:

1. *Issue description*
2. *Issue description*

---

## AI Tools Used

- **ChatGPT/Claude**: Used for code generation and documentation assistance
- **GitHub Copilot**: Used for code suggestions

*Note: All code was reviewed and tested. AI tools were used as assistants, not as primary development tools.*

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-XX | Initial test procedures |

