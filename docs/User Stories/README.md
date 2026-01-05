# User Stories

This document contains user stories for the Singapore Routing App UI, including functionalities and acceptance criteria.

## Overview

The Singapore Routing App UI is a web application that provides routing functionality similar to Google Maps, but using OpenStreetMap data specifically for Singapore. Users can plan routes, visualize road types, and manage blockages.

---

## User Story 1: Server Status Check

**As a** user  
**I want** to see if the routing server is ready  
**So that** I know when I can use the routing features

### Acceptance Criteria

- [ ] Application displays server status indicator on the map
- [ ] Status indicator shows "Server Ready" when server is available
- [ ] Status indicator shows "Server Starting..." when server is initializing
- [ ] Status indicator shows "Server Error" when server is unavailable
- [ ] Status is automatically checked every 5 seconds
- [ ] Status indicator is visible and does not obstruct map interaction
- [ ] Visual indicator uses color coding (green for ready, orange for starting, red for error)

### Priority

High - Critical for user experience

---

## User Story 2: Set Start and End Points

**As a** user  
**I want** to set start and end points for my route  
**So that** I can plan my journey

### Acceptance Criteria

- [ ] User can click on the map to set start point
- [ ] User can click on the map to set end point
- [ ] Start point marker appears on map after selection
- [ ] End point marker appears on map after selection
- [ ] Start and end points are visually distinct (different markers or colors)
- [ ] Coordinates of selected points are displayed in the route planner panel
- [ ] User can enter optional descriptions for start and end points
- [ ] User can clear start point and set a new one
- [ ] User can clear end point and set a new one

### Priority

High - Core functionality

---

## User Story 3: Calculate Route

**As a** user  
**I want** to calculate the shortest route between start and end points  
**So that** I can see the optimal path

### Acceptance Criteria

- [ ] "Calculate Route" button is enabled only when both start and end points are set
- [ ] Clicking "Calculate Route" sends request to backend API
- [ ] Loading indicator shows while route is being calculated
- [ ] Calculated route is displayed as a line on the map
- [ ] Route line is clearly visible with appropriate color and width
- [ ] Map automatically adjusts bounds to show the entire route

### Priority

High - Core functionality

---

## User Story 4: View Road Types

**As a** user  
**I want** to visualize different road types on the map  
**So that** I can understand the road network

### Acceptance Criteria

- [ ] Road type viewer panel is available on the map
- [ ] Panel displays list of all available road types from backend
- [ ] User can click on a road type to visualize it on the map
- [ ] Selected road type roads are displayed on the map with appropriate styling
- [ ] Only one road type can be visualized at a time
- [ ] User can clear the road type visualization

### Priority

Medium - Enhancement feature

---

## User Story 5: View Blockages

**As a** user  
**I want** to see all active blockages on the map  
**So that** I am aware of road closures

### Acceptance Criteria

- [ ] All blockages from the server are displayed on the map on application load
- [ ] Blockages are displayed as circular areas with red styling
- [ ] Blockage list is displayed in the blockage manager panel
- [ ] Each blockage shows name, description, and radius
- [ ] Blockages are refreshed when added or deleted
- [ ] Blockages affect route calculations (routes avoid blocked areas)

### Priority

Medium - Important feature

---

## User Story 6: Add Blockage

**As a** user  
**I want** to add new blockages to the map  
**So that** I can mark road closures or obstacles

### Acceptance Criteria

- [ ] User can open the blockage form by clicking "Add Blockage" button
- [ ] When blockage form is open, clicking map selects location for blockage
- [ ] Blockage manager panel allows entering blockage details
- [ ] Required fields: name (unique), radius (in meters)
- [ ] Optional fields: description
- [ ] Selected location coordinates are displayed
- [ ] Success feedback is provided when blockage is added
- [ ] New blockage appears on map immediately after adding

### Priority

Medium - Important feature

---

## User Story 7: Delete Blockage

**As a** user  
**I want** to delete existing blockages  
**So that** I can remove blockages that are no longer relevant

### Acceptance Criteria

- [ ] Each blockage in the list has a "Delete" button
- [ ] Clicking delete button removes blockage from server
- [ ] Confirmation could be implemented (optional)
- [ ] Blockage disappears from map after deletion
- [ ] Blockage list is updated after successful deletion

### Priority

Medium - Important feature

---

## User Story 8: Route Display

**As a** user  
**I want** to see the calculated route clearly on the map  
**So that** I can follow the path

### Acceptance Criteria

- [ ] Route is displayed as a continuous line
- [ ] Route line has appropriate color
- [ ] Route line has sufficient width to be clearly visible
- [ ] Route line opacity allows seeing underlying map features
- [ ] Map automatically fits bounds to show entire route
- [ ] Start and end markers remain visible with route

### Priority

High - Core functionality

---

## Non-Functional Requirements

### Performance

- Route calculation should complete within 30 seconds
- Map should render smoothly (60fps during pan/zoom)
- Road type visualization should not cause significant lag

### Browser Compatibility

- Application should work on modern browsers (Chrome, Firefox, Safari, Edge)
- Tested on latest versions

### Accessibility

- UI elements should be keyboard accessible where appropriate
- Color contrast meets WCAG guidelines
- Text is readable

---

## User Story Dependencies

1. **Server Status Check** (US1) should be implemented first to ensure server availability
2. **Set Start/End Points** (US2) must be implemented before **Calculate Route** (US3)
3. **View Blockages** (US5) should be implemented before add/delete blockage features

---

## Testing Notes

- All user stories should be tested with actual backend API
- Test with different coordinate pairs within Singapore
- Test edge cases (same start/end point, very long routes, etc.)
- Test with server in different states (ready, starting, error)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-XX | Initial version with all user stories |

