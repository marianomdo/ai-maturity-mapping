# AI Maturity Mapping Application

A web application for mapping and visualizing the AI maturity of companies using a Trello-like board interface. This MVP enables users to assess and track AI maturity across predefined categories and levels with interactive, draggable cards.

## Features

### Core Functionality
- **Company Management**: Create, select, and manage multiple companies
- **AI Maturity Board**: Visual Trello-like interface with categories and levels
- **Drag & Drop Cards**: Move AI initiative cards between maturity levels
- **Detailed Card Management**: Rich card details with justifications and recommendations

### Predefined Categories
- Data Foundation
- AI Strategy  
- Talent & Culture
- Technology & Tools

### Maturity Levels
- Level 0: Nascent (Red)
- Level 1: Foundational (Orange)
- Level 2: Developing (Yellow)
- Level 3: Operationalized (Light Green)
- Level 4: Optimized (Green)

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **RESTful API** design
- Input validation and error handling

### Frontend
- **React 18** with modern hooks
- **Material-UI (MUI)** for components
- **react-beautiful-dnd** for drag-and-drop
- **React Router** for navigation
- **Axios** for API calls

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and setup the project:**
```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

2. **Configure environment:**
```bash
# Copy the config template
cp backend/config.env backend/.env

# Edit backend/.env with your MongoDB connection:
# MONGODB_URI=mongodb://localhost:27017/ai-maturity-db
# PORT=5000
# NODE_ENV=development
```

3. **Start the application:**
```bash
# Start both backend and frontend concurrently
npm run dev

# Or start individually:
npm run server  # Backend only (port 5000)
npm run client  # Frontend only (port 3000)
```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Usage Guide

### Getting Started
1. **Create a Company**: Click "Add Company" to create your first company
2. **Select Company**: Choose a company from the dropdown to view its maturity board
3. **Add AI Initiative Cards**: Click the "+" button in any category/level intersection
4. **Fill Card Details**: Click on any card to add detailed information
5. **Move Cards**: Drag and drop cards between maturity levels as initiatives progress

### Card Information
Each AI initiative card contains:
- **Title**: Short descriptive name
- **Description**: Detailed explanation
- **Current Score Justification**: Why it's at this maturity level
- **Next Steps**: What's needed to advance to the next level  
- **Relevant Link**: URL to documentation or resources

### Board Navigation
- **Categories** (vertical): Core AI maturity areas
- **Levels** (horizontal): Maturity progression from Nascent to Optimized
- **Color Coding**: Each level has a distinct color for easy visualization
- **Drag & Drop**: Cards can only move between levels within the same category

## API Endpoints

### Companies
- `GET /api/companies` - List all companies
- `POST /api/companies` - Create new company
- `GET /api/companies/:id` - Get company by ID
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### AI Cards  
- `GET /api/cards/company/:companyId` - Get all cards for a company
- `POST /api/cards` - Create new card
- `GET /api/cards/:id` - Get card by ID
- `PUT /api/cards/:id` - Update card
- `PATCH /api/cards/:id/position` - Update card position (drag & drop)
- `DELETE /api/cards/:id` - Delete card

## Development

### Project Structure
```
ai-maturity-mapping/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── constants/   # App constants
│   │   ├── services/    # API services
│   │   └── App.js
│   └── package.json
└── package.json         # Root package.json
```

### Key Components
- **Dashboard**: Main container managing state and data flow
- **CompanySelector**: Company creation and selection
- **MaturityBoard**: Main board with drag-drop context
- **MaturityColumn**: Individual category/level intersections  
- **AICard**: Draggable card components
- **CardDetailsModal**: Detailed card editing interface

### Database Schema
- **Company**: `{ _id, name, createdAt, updatedAt }`
- **AICard**: `{ _id, companyId, categoryName, levelName, title, description, currentScoreJustification, nextStepsRecommendations, relevantLink, createdAt, updatedAt }`

## Troubleshooting

### Common Issues

1. **globalIgnore Error**: If you encounter "blocked by globalIgnore" errors in Cursor:
   - Go to Cursor menu → Settings → VSCode Settings
   - Search for "global ignore"
   - Review and modify ignore patterns as needed

2. **MongoDB Connection**: Ensure MongoDB is running and the connection string is correct in `.env`

3. **Port Conflicts**: Default ports are 3000 (frontend) and 5000 (backend). Change in package.json if needed.

4. **CORS Issues**: The backend is configured to allow all origins in development. Adjust CORS settings for production.

## Future Enhancements

This MVP provides the foundation for:
- User authentication and authorization
- Multi-tenant support with team management
- Advanced analytics and reporting
- Custom category and level definitions
- Import/export functionality
- Automated maturity scoring
- Integration with external AI tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project as a foundation for your AI maturity assessment needs. 