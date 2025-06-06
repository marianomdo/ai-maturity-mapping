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

function MaturityColumn({ category, level, card, onCardCreate, onCardClick, isEmpty, isCurrentLevel }) {
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
        elevation={2} 
        sx={{ 
          height: '120px',
          p: 1,
          bgcolor: isCurrentLevel ? levelColor + '40' : (levelColor + '10'), // Stronger color if current level
          border: isCurrentLevel ? `3px solid ${levelColor}` : `1px solid ${levelColor}`,
          position: 'relative'
        }}
      >
        {/* Add Card Button - only show if this category has no card yet */}
        {isEmpty && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Tooltip title={`Add ${category} Card`}>
              <IconButton 
                size="large" 
                onClick={() => setAddCardDialogOpen(true)}
                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Droppable Area */}
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                minHeight: isEmpty ? '0px' : '100px',
                bgcolor: snapshot.isDraggingOver ? levelColor + '50' : 'transparent',
                borderRadius: 1,
                p: 0.5,
                display: isEmpty ? 'none' : 'block'
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