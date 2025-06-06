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
            backgroundColor: '#FFFFFF',
            border: '2px solid #8697C4'
          }}
        >
          {/* Level Headers */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={2}>
              <Box 
                sx={{ 
                  backgroundColor: '#3D52A0',
                  color: 'white',
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Categories / Levels
                </Typography>
              </Box>
            </Grid>
            {MATURITY_LEVELS.map((level, index) => {
              // Use different solid colors for each level
              const levelColors = [
                '#3D52A0', // Level 0 - Deep blue
                '#7091E6', // Level 1 - Bright blue
                '#8697C4', // Level 2 - Lavender
                '#ADBBDA', // Level 3 - Light purple
                '#EDE8F5', // Level 4 - Very light lavender
              ];
              
              const backgroundColor = levelColors[index];
              const textColor = index >= 3 ? '#3D52A0' : 'white';
              
              return (
                <Grid item xs={2} key={level}>
                  <Box 
                    sx={{ 
                      backgroundColor: backgroundColor,
                      color: textColor,
                      p: 2,
                      borderRadius: 2,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      border: index >= 3 ? `2px solid #3D52A0` : 'none'
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
          {MATURITY_CATEGORIES.map((category, categoryIndex) => {
            const categoryCard = getCardForCategory(category);
            
            // Use different colors for each category to differentiate them
            const categoryColors = [
              '#7091E6', // Data Foundation - Bright blue
              '#8697C4', // AI Strategy - Lavender  
              '#ADBBDA', // Talent & Culture - Light purple
              '#3D52A0', // Technology & Tools - Deep blue
            ];
            
            const categoryColor = categoryColors[categoryIndex] || '#3D52A0';
            const categoryTextColor = categoryIndex === 2 ? '#3D52A0' : 'white';
            
            return (
              <Grid container spacing={1} key={category} sx={{ mb: 2 }}>
                <Grid item xs={2}>
                  <Box 
                    sx={{ 
                      backgroundColor: categoryColor,
                      color: categoryTextColor,
                      p: 2, 
                      borderRadius: 2,
                      height: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 3px 8px ${categoryColor}40`,
                      border: categoryIndex === 2 ? `2px solid #3D52A0` : 'none'
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