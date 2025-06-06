import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Maturity Mapping
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App; 