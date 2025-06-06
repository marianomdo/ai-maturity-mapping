import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import CompanySelector from './CompanySelector';
import MaturityBoard from './MaturityBoard';
import { companyAPI, cardsAPI } from '../services/api';

function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      loadCards(selectedCompany.id);
    } else {
      setCards([]);
    }
  }, [selectedCompany]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getAll();
      setCompanies(response.data);
      if (response.data.length > 0) {
        setSelectedCompany(response.data[0]);
      }
    } catch (err) {
      setError('Failed to load companies');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCards = async (companyId) => {
    try {
      const response = await cardsAPI.getByCompanyId(companyId);
      setCards(response.data);
    } catch (err) {
      setError('Failed to load cards');
      console.error('Error loading cards:', err);
    }
  };

  const handleCompanyCreate = async (companyData) => {
    try {
      const response = await companyAPI.create(companyData);
      const newCompany = response.data;
      setCompanies(prev => [...prev, newCompany]);
      setSelectedCompany(newCompany);
      return newCompany;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create company');
    }
  };

  const handleCardCreate = async (cardData) => {
    try {
      const response = await cardsAPI.create({
        ...cardData,
        companyId: selectedCompany.id
      });
      const newCard = response.data;
      setCards(prev => [...prev, newCard]);
      return newCard;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create card');
    }
  };

  const handleCardUpdate = async (cardId, cardData) => {
    try {
      const response = await cardsAPI.update(cardId, cardData);
      const updatedCard = response.data;
      setCards(prev => prev.map(card => 
        card.id === cardId ? updatedCard : card
      ));
      return updatedCard;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update card');
    }
  };

  const handleCardPositionUpdate = async (cardId, newPosition) => {
    try {
      const response = await cardsAPI.updatePosition(cardId, newPosition);
      const updatedCard = response.data;
      setCards(prev => prev.map(card => 
        card.id === cardId ? updatedCard : card
      ));
      return updatedCard;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update card position');
    }
  };

  const handleCardDelete = async (cardId) => {
    try {
      await cardsAPI.delete(cardId);
      setCards(prev => prev.filter(card => card.id !== cardId));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete card');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Maturity Dashboard
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <CompanySelector
          companies={companies}
          selectedCompany={selectedCompany}
          onCompanySelect={setSelectedCompany}
          onCompanyCreate={handleCompanyCreate}
        />
      </Paper>

      {selectedCompany ? (
        <MaturityBoard
          company={selectedCompany}
          cards={cards}
          onCardCreate={handleCardCreate}
          onCardUpdate={handleCardUpdate}
          onCardPositionUpdate={handleCardPositionUpdate}
          onCardDelete={handleCardDelete}
        />
      ) : (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Please create or select a company to view its AI maturity board
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default Dashboard; 