import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #3D52A0 0%, #7091E6 25%, #8697C4 50%, #ADBBDA 75%, #EDE8F5 100%)',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #3D52A0 0%, #7091E6 50%, #8697C4 100%)',
            py: 4,
            px: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Container maxWidth="xl">
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                color: 'white',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                textAlign: 'center',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                mb: 1
              }}
            >
              AI MATURITY
            </Typography>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 300,
                letterSpacing: '0.05em',
                textAlign: 'center',
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              MAPPING
            </Typography>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App; 