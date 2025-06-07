import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import AICard from './AICard';
import { LEVEL_COLORS } from '../constants/maturityData';

function MaturityColumn({ category, level, card, onCardCreate, onCardClick, showAddButton, isCurrentLevel }) {
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const droppableId = `${category}||${level}`;

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) {
      setError('Card title is required');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await onCardCreate({
        categoryName: category,
        levelName: level,
        title: newCardTitle.trim()
      });
      setAddCardDialogOpen(false);
      setNewCardTitle('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleAddCancel = () => {
    setAddCardDialogOpen(false);
    setNewCardTitle('');
    setError(null);
  };

  // Define solid colors for each level using blue progression
  const getLevelColor = (level) => {
    const colors = {
      'Level 0: Nascent': '#3D52A0',      // Deep blue
      'Level 1: Awareness': '#4A5FA8',    // Medium-deep blue
      'Level 2: Developing': '#7091E6',   // Bright blue
      'Level 3: Defined': '#8697C4',      // Lavender blue
      'Level 4: Optimized': '#ADBBDA'     // Light purple-blue
    };
    return colors[level] || '#3D52A0';
  };

  return (
    <>
      <Paper 
        elevation={isCurrentLevel ? 4 : 0} 
        sx={{ 
          height: { xs: '60px', md: '120px' },
          p: { xs: 0.25, md: 1 },
          backgroundColor: isCurrentLevel 
            ? getLevelColor(level) 
            : `${getLevelColor(level)}20`, // 20% opacity for empty slots
          border: isCurrentLevel 
            ? `3px solid ${getLevelColor(level)}` 
            : `1px solid ${getLevelColor(level)}40`,
          borderRadius: 2,
          position: 'relative',
          boxShadow: isCurrentLevel 
            ? `0 4px 12px ${getLevelColor(level)}40` 
            : 'none',
          '&:hover': !isCurrentLevel ? {
            backgroundColor: `${getLevelColor(level)}30`,
            borderColor: `${getLevelColor(level)}60`,
            transition: 'all 0.2s ease'
          } : {}
        }}
      >
        {/* Droppable Area - always present for drag and drop */}
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                height: '100%',
                minHeight: { xs: '55px', md: '100px' },
                backgroundColor: snapshot.isDraggingOver 
                  ? `${getLevelColor(level)}60` 
                  : 'transparent',
                borderRadius: 1,
                p: { xs: 0.1, md: 0.5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: snapshot.isDraggingOver 
                  ? `3px dashed ${getLevelColor(level)}` 
                  : 'none',
                transition: 'all 0.2s ease',
                overflow: 'hidden' // Ensure cards don't overflow
              }}
            >
              {card && (
                <Box sx={{ width: '100%', height: 'fit-content' }}>
                  <AICard
                    key={card.id}
                    card={card}
                    index={0}
                    onClick={() => onCardClick(card)}
                  />
                </Box>
              )}
              
              {/* Add Card Button - only show if this category has no card yet */}
              {showAddButton && !card && (
                <Tooltip title={`Add ${category} Card`}>
                  <IconButton 
                    size="small"
                    onClick={() => setAddCardDialogOpen(true)}
                    sx={{ 
                      backgroundColor: '#FFFFFF',
                      color: '#3D52A0',
                      border: `2px solid #3D52A0`,
                      boxShadow: '0 2px 8px rgba(61,82,160,0.2)',
                      width: { xs: '24px', md: '48px' },
                      height: { xs: '24px', md: '48px' },
                      '&:hover': { 
                        backgroundColor: '#3D52A0',
                        color: '#FFFFFF',
                        transform: 'scale(1.1)',
                        transition: 'all 0.2s ease'
                      } 
                    }}
                  >
                    <Add sx={{ fontSize: { xs: '0.8rem', md: '1.5rem' } }} />
                  </IconButton>
                </Tooltip>
              )}
              
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Paper>

      {/* Add Card Dialog */}
      <Dialog open={addCardDialogOpen} onClose={handleAddCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Add New AI Initiative Card</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Card Title"
            fullWidth
            variant="outlined"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddCard();
              }
            }}
            disabled={creating}
            helperText={`Category: ${category} | Level: ${level}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCancel} disabled={creating}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddCard} 
            variant="contained"
            disabled={creating || !newCardTitle.trim()}
          >
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MaturityColumn; 