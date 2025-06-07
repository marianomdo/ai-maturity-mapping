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
            p: { xs: 1, md: 3 }, 
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            border: '2px solid #8697C4'
          }}
        >
          {/* Level Headers */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={12} md={2}>
              <Box 
                sx={{ 
                  backgroundColor: '#F5F5F5', // Light gray for category header
                  color: '#333333',
                  p: { xs: 1, md: 2 },
                  borderRadius: 2,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '2px solid #E0E0E0'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', md: '0.9rem' } }}>
                  Categories / Levels
                </Typography>
              </Box>
            </Grid>
            {MATURITY_LEVELS.map((level, index) => {
              // Use blue progression for levels
              const levelColors = [
                '#3D52A0', // Level 0 - Deep blue
                '#4A5FA8', // Level 1 - Medium-deep blue
                '#7091E6', // Level 2 - Bright blue
                '#8697C4', // Level 3 - Lavender blue
                '#ADBBDA', // Level 4 - Light purple-blue
              ];
              
              const backgroundColor = levelColors[index];
              const textColor = index >= 3 ? '#3D52A0' : 'white';
              
              return (
                <Grid item xs={2.4} md={2} key={level}>
                  <Box 
                    sx={{ 
                      backgroundColor: backgroundColor,
                      color: textColor,
                      p: { xs: 0.5, md: 2 },
                      borderRadius: 2,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      border: index >= 3 ? `2px solid #3D52A0` : 'none',
                      minHeight: { xs: '35px', md: 'auto' }
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.6rem', md: '0.9rem' },
                        lineHeight: 1.1
                      }}
                    >
                      {level.replace('Level ', 'L').replace(':', '')} {/* Shorten for mobile */}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Category Rows */}
          {MATURITY_CATEGORIES.map((category, categoryIndex) => {
            const categoryCard = getCardForCategory(category);
            
            // Use light gray tones for categories
            const categoryColors = [
              '#E8E8E8', // Data Foundation - Light gray
              '#D4D4D4', // AI Strategy - Medium gray  
              '#C0C0C0', // Talent & Culture - Darker gray
              '#B0B0B0', // Technology & Tools - Dark gray
            ];
            
            const categoryColor = categoryColors[categoryIndex] || '#E8E8E8';
            const categoryTextColor = '#333333'; // Dark text for all gray backgrounds
            
            return (
              <Grid container spacing={1} key={category} sx={{ mb: 1 }}>
                <Grid item xs={12} md={2}>
                  <Box 
                    sx={{ 
                      backgroundColor: categoryColor,
                      color: categoryTextColor,
                      p: { xs: 1, md: 2 }, 
                      borderRadius: 2,
                      height: { xs: '60px', md: '120px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 2px 4px ${categoryColor}80`,
                      border: `2px solid #999999`
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textAlign: 'center',
                        fontSize: { xs: '0.7rem', md: '1rem' },
                        fontWeight: 'bold',
                        letterSpacing: '0.05em',
                        lineHeight: 1.2
                      }}
                    >
                      {category}
                    </Typography>
                  </Box>
                </Grid>
                
                {MATURITY_LEVELS.map((level, levelIndex) => (
                  <Grid item xs={2.4} md={2} key={`${category}-${level}`}>
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