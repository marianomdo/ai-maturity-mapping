import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert
} from '@mui/material';
import MaturityColumn from './MaturityColumn';
import CardDetailsModal from './CardDetailsModal';
import { MATURITY_CATEGORIES, MATURITY_LEVELS } from '../constants/maturityData';

function MaturityBoard({ 
  company, 
  cards, 
  onCardCreate, 
  onCardUpdate, 
  onCardPositionUpdate, 
  onCardDelete 
}) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Group cards by category and level
  const getCardsForCategoryAndLevel = (category, level) => {
    return cards.filter(card => 
      card.categoryName === category && card.levelName === level
    );
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setDetailsModalOpen(true);
  };

  const handleCardDetailsUpdate = async (cardData) => {
    try {
      await onCardUpdate(selectedCard.id, cardData);
      setDetailsModalOpen(false);
      setSelectedCard(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCardDetailsDelete = async () => {
    try {
      await onCardDelete(selectedCard.id);
      setDetailsModalOpen(false);
      setSelectedCard(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside valid droppable area
    if (!destination) {
      return;
    }

    // Dropped in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      // Parse destination to get category and level
      const [destCategory, destLevel] = destination.droppableId.split('||');
      
      await onCardPositionUpdate(parseInt(draggableId), {
        categoryName: destCategory,
        levelName: destLevel
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        AI Maturity Board - {company.name}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Paper elevation={1} sx={{ p: 2 }}>
          {/* Level Headers */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={2}>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Categories / Levels
              </Typography>
            </Grid>
            {MATURITY_LEVELS.map((level) => (
              <Grid item xs={2} key={level}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  {level}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Category Rows */}
          {MATURITY_CATEGORIES.map((category) => (
            <Grid container spacing={1} key={category} sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'primary.main', 
                    color: 'primary.contrastText',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {category}
                  </Typography>
                </Paper>
              </Grid>
              
              {MATURITY_LEVELS.map((level) => (
                <Grid item xs={2} key={`${category}-${level}`}>
                  <MaturityColumn
                    category={category}
                    level={level}
                    cards={getCardsForCategoryAndLevel(category, level)}
                    onCardCreate={onCardCreate}
                    onCardClick={handleCardClick}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Paper>
      </DragDropContext>

      {/* Card Details Modal */}
      {selectedCard && (
        <CardDetailsModal
          open={detailsModalOpen}
          card={selectedCard}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedCard(null);
          }}
          onUpdate={handleCardDetailsUpdate}
          onDelete={handleCardDetailsDelete}
        />
      )}
    </Box>
  );
}

export default MaturityBoard; 