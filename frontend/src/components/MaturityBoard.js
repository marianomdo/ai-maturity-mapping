import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import MaturityColumn from './MaturityColumn';
import CardDetailsModal from './CardDetailsModal';
import { MATURITY_CATEGORIES, MATURITY_LEVELS } from '../constants/maturityData';
import { Close } from '@mui/icons-material';

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
  const [levelDescriptionDialog, setLevelDescriptionDialog] = useState(null);

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

  const handleLevelClick = (level, levelDescription) => {
    if (window.innerWidth < 768) { // Only on mobile
      setLevelDescriptionDialog({ level, description: levelDescription });
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

  if (!company) {
    return null;
  }

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
              // Use lighter blue progression
              const levelColors = [
                '#f5f9ff', // Level 0 - Very light blue-white
                '#e3f2fd', // Level 1 - Light blue
                '#bbdefb', // Level 2 - Slightly darker light blue
                '#90caf9', // Level 3 - Medium light blue
                '#64b5f6', // Level 4 - Medium blue
              ];
              
              const backgroundColor = levelColors[index];
              // Use consistent dark blue text for better readability on light backgrounds
              const textColor = '#1565c0';
              
              // Split level into number and description
              const levelMatch = level.match(/^(Level \d+):\s*(.+)$/);
              const levelNumber = levelMatch ? levelMatch[1].replace('Level ', 'L') : `L${index}`;
              const levelDescription = levelMatch ? levelMatch[2] : level;
              
              // Truncate description for mobile if too long
              const truncatedDescription = levelDescription.length > 8 ? 
                levelDescription.substring(0, 8) + '...' : levelDescription;
              
              return (
                <Grid item xs={2.4} md={2} key={level}>
                  <Box 
                    onClick={() => handleLevelClick(levelNumber, levelDescription)}
                    sx={{ 
                      backgroundColor: backgroundColor,
                      color: textColor,
                      p: { xs: 0.25, md: 2 },
                      borderRadius: 2,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      border: `1px solid ${levelColors[4]}30`,
                      minHeight: { xs: '35px', md: 'auto' },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: { xs: 'pointer', md: 'default' },
                      '&:hover': {
                        backgroundColor: { xs: `${levelColors[2]}50`, md: backgroundColor },
                        transition: 'background-color 0.2s ease'
                      }
                    }}
                  >
                    {/* Level Number */}
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.65rem', md: '0.9rem' },
                        lineHeight: 1
                      }}
                    >
                      {levelNumber}
                    </Typography>
                    
                    {/* Level Description - Hidden on mobile */}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 'normal',
                        fontSize: { xs: '0.45rem', md: '0.7rem' },
                        lineHeight: 1,
                        mt: { xs: 0.1, md: 0.2 },
                        display: { xs: 'none', md: 'block' } // Hide on mobile
                      }}
                    >
                      {levelDescription}
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
              '#F7F4FB', // Data Foundation - Very light lavender
              '#EDE8F5', // AI Strategy - Light lavender
              '#E3DCEF', // Talent & Culture - Medium light lavender
              '#D9D0E9', // Technology & Tools - Medium lavender
            ];
            
            const categoryColor = categoryColors[categoryIndex] || '#F7F4FB';
            const categoryTextColor = '#3D52A0'; // Deep blue for better contrast
            
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
                      boxShadow: `0 2px 4px ${categoryColor}60`,
                      border: `2px solid #ADBBDA40`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: `${categoryColor}E0`,
                        boxShadow: `0 2px 6px ${categoryColor}80`,
                      }
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

      {/* Mobile Level Description Dialog */}
      <Dialog
        open={!!levelDescriptionDialog}
        onClose={() => setLevelDescriptionDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: '#6B7FD7', 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {levelDescriptionDialog?.level}
          </Typography>
          <IconButton 
            onClick={() => setLevelDescriptionDialog(null)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: '#F8F9FF' }}>
          <Typography variant="body1" sx={{ 
            color: '#2C3E50', 
            fontSize: '1.1rem',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            {levelDescriptionDialog?.description}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default MaturityBoard; 