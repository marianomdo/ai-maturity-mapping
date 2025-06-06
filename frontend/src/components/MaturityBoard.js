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

  // Get the single card for each category
  const getCardForCategory = (category) => {
    return cards.find(card => card.categoryName === category);
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
      const [sourceCategory] = source.droppableId.split('||');
      
      // Only allow moves within the same category (horizontal movement between levels)
      if (destCategory !== sourceCategory) {
        setError('Cards can only be moved between levels within the same category');
        return;
      }
      
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
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          mb: 3
        }}
      >
        {company.name}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Level Headers */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={2}>
              <Box 
                sx={{ 
                  background: 'linear-gradient(135deg, #3D52A0 0%, #7091E6 100%)',
                  color: 'white',
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Categories / Levels
                </Typography>
              </Box>
            </Grid>
            {MATURITY_LEVELS.map((level, index) => {
              // Create gradient for each level using the color palette
              const gradients = [
                'linear-gradient(135deg, #3D52A0 0%, #3D52A0 100%)', // Level 0 - Deep blue
                'linear-gradient(135deg, #3D52A0 0%, #7091E6 100%)', // Level 1 - Blue to light blue
                'linear-gradient(135deg, #7091E6 0%, #8697C4 100%)', // Level 2 - Light blue to purple
                'linear-gradient(135deg, #8697C4 0%, #ADBBDA 100%)', // Level 3 - Purple to lavender
                'linear-gradient(135deg, #ADBBDA 0%, #EDE8F5 100%)', // Level 4 - Lavender to light
              ];
              
              return (
                <Grid item xs={2} key={level}>
                  <Box 
                    sx={{ 
                      background: gradients[index],
                      color: index >= 3 ? '#3D52A0' : 'white',
                      p: 2,
                      borderRadius: 2,
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      {level}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Category Rows */}
          {MATURITY_CATEGORIES.map((category) => {
            const categoryCard = getCardForCategory(category);
            return (
              <Grid container spacing={1} key={category} sx={{ mb: 2 }}>
                <Grid item xs={2}>
                  <Box 
                    sx={{ 
                      background: 'linear-gradient(135deg, #3D52A0 0%, #7091E6 100%)',
                      color: 'white',
                      p: 2, 
                      borderRadius: 2,
                      height: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(61,82,160,0.3)'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textAlign: 'center',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {category}
                    </Typography>
                  </Box>
                </Grid>
                
                {MATURITY_LEVELS.map((level, levelIndex) => (
                  <Grid item xs={2} key={`${category}-${level}`}>
                    <MaturityColumn
                      category={category}
                      level={level}
                      card={categoryCard && categoryCard.levelName === level ? categoryCard : null}
                      onCardCreate={onCardCreate}
                      onCardClick={handleCardClick}
                      showAddButton={!categoryCard && levelIndex === 0} // Only show + button in first column if no card exists
                      isCurrentLevel={categoryCard && categoryCard.levelName === level}
                    />
                  </Grid>
                ))}
              </Grid>
            );
          })}
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