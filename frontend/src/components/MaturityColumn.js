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

  return (
    <>
      <Paper 
        elevation={isCurrentLevel ? 2 : 0} 
        sx={{ 
          height: '120px',
          p: 1,
          bgcolor: isCurrentLevel ? levelColor + '40' : (levelColor + '05'), // Much fainter for empty slots
          border: isCurrentLevel ? `3px solid ${levelColor}` : 'none', // No border for empty blocks
          position: 'relative',
          '&:hover': !isCurrentLevel ? {
            bgcolor: levelColor + '10',
            transition: 'background-color 0.2s ease'
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
                bgcolor: snapshot.isDraggingOver ? levelColor + '60' : 'transparent',
                borderRadius: 1,
                p: 0.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: snapshot.isDraggingOver ? `2px dashed ${levelColor}` : 'none',
                transition: 'all 0.2s ease'
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
                    sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
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