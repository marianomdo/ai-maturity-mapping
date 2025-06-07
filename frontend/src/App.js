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
          backgroundColor: '#EDE8F5', // Light lavender background
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            backgroundColor: '#3D52A0', // Solid deep blue
            py: { xs: 2, md: 4 },
            px: { xs: 2, md: 3 },
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
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                mb: { xs: 0.5, md: 1 }
              }}
            >
              AI MATURITY
            </Typography>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                color: '#ADBBDA', // Light purple accent
                fontWeight: 300,
                letterSpacing: '0.05em',
                textAlign: 'center',
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
              }}
            >
              MAPPING
            </Typography>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 3 } }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App; 