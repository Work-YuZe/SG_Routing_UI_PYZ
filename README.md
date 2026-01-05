# Singapore Routing App UI

A routing application for Singapore that uses OpenStreetMap data, similar to Google Maps functionality.

## Features

- Interactive map using OpenStreetMap data
- Route planning between start and end points
- Multiple travel modes (car, bicycle, etc.)
- Road type visualization
- Blockage management
- Real-time route calculation

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build

```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── services/       # API services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main application component
├── docs/               # Project documentation
│   ├── Software Interface Agreement/
│   ├── User Stories/
│   ├── Test Procedures/
│   └── Software Design Description/
└── public/             # Static assets
```

## Documentation

See the `docs/` folder for detailed documentation including:
- Software Interface Agreement
- User Stories with Acceptance Criteria
- Test Procedures
- Software Design Description

## API Endpoints

The application uses the following backend APIs:
- Server readiness check
- Road type management
- Route calculation
- Blockage management

See the Software Interface Agreement for detailed API documentation.

