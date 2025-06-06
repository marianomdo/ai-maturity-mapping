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
  const levelColor = LEVEL_COLORS[level];

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

  // Define gradient backgrounds for each level
  const getLevelGradient = (level) => {
    const gradients = {
      'Level 0: Nascent': 'linear-gradient(135deg, rgba(61,82,160,0.1) 0%, rgba(61,82,160,0.05) 100%)',
      'Level 1: Awareness': 'linear-gradient(135deg, rgba(61,82,160,0.2) 0%, rgba(112,145,230,0.1) 100%)',
      'Level 2: Developing': 'linear-gradient(135deg, rgba(112,145,230,0.2) 0%, rgba(134,151,196,0.1) 100%)',
      'Level 3: Defined': 'linear-gradient(135deg, rgba(134,151,196,0.2) 0%, rgba(173,187,218,0.1) 100%)',
      'Level 4: Optimized': 'linear-gradient(135deg, rgba(173,187,218,0.2) 0%, rgba(237,232,245,0.1) 100%)'
    };
    return gradients[level] || 'transparent';
  };

  const getCurrentLevelGradient = (level) => {
    const gradients = {
      'Level 0: Nascent': 'linear-gradient(135deg, rgba(61,82,160,0.8) 0%, rgba(61,82,160,0.6) 100%)',
      'Level 1: Awareness': 'linear-gradient(135deg, rgba(61,82,160,0.8) 0%, rgba(112,145,230,0.6) 100%)',
      'Level 2: Developing': 'linear-gradient(135deg, rgba(112,145,230,0.8) 0%, rgba(134,151,196,0.6) 100%)',
      'Level 3: Defined': 'linear-gradient(135deg, rgba(134,151,196,0.8) 0%, rgba(173,187,218,0.6) 100%)',
      'Level 4: Optimized': 'linear-gradient(135deg, rgba(173,187,218,0.8) 0%, rgba(237,232,245,0.6) 100%)'
    };
    return gradients[level] || 'transparent';
  };

  return (
    <>
      <Paper 
        elevation={isCurrentLevel ? 6 : 0} 
        sx={{ 
          height: '120px',
          p: 1,
          background: isCurrentLevel ? getCurrentLevelGradient(level) : getLevelGradient(level),
          border: isCurrentLevel ? '3px solid rgba(255,255,255,0.5)' : 'none',
          borderRadius: 2,
          position: 'relative',
          boxShadow: isCurrentLevel ? '0 8px 25px rgba(61,82,160,0.3)' : 'none',
          '&:hover': !isCurrentLevel ? {
            background: getLevelGradient(level).replace('0.1', '0.15'),
            transition: 'all 0.3s ease'
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
                minHeight: '100px',
                background: snapshot.isDraggingOver ? getCurrentLevelGradient(level) : 'transparent',
                borderRadius: 1,
                p: 0.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: snapshot.isDraggingOver ? '3px dashed rgba(255,255,255,0.8)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {card && (
                <AICard
                  key={card.id}
                  card={card}
                  index={0}
                  onClick={() => onCardClick(card)}
                />
              )}
              
              {/* Add Card Button - only show if this category has no card yet */}
              {showAddButton && !card && (
                <Tooltip title={`Add ${category} Card`}>
                  <IconButton 
                    size="large" 
                    onClick={() => setAddCardDialogOpen(true)}
                    sx={{ 
                      background: 'linear-gradient(135deg, #3D52A0 0%, #7091E6 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(61,82,160,0.4)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #7091E6 0%, #8697C4 100%)',
                        transform: 'scale(1.1)',
                        transition: 'all 0.2s ease'
                      } 
                    }}
                  >
                    <Add />
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