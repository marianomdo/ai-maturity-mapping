import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Alert
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { LEVEL_COLORS } from '../constants/maturityData';

function CardDetailsModal({ open, card, onClose, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    currentScoreJustification: '',
    nextStepsRecommendations: '',
    relevantLink: ''
  });
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        description: card.description || '',
        currentScoreJustification: card.currentScoreJustification || '',
        nextStepsRecommendations: card.nextStepsRecommendations || '',
        relevantLink: card.relevantLink || ''
      });
    }
  }, [card]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      await onUpdate(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (!card) return null;

  const levelColor = LEVEL_COLORS[card.levelName];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">AI Initiative Details</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Category and Level Info */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={card.categoryName} 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={card.levelName}
            sx={{ 
              bgcolor: levelColor + '20',
              color: levelColor,
              border: `1px solid ${levelColor}`
            }}
          />
        </Box>

        {/* Form Fields */}
        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={handleInputChange('title')}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={handleInputChange('description')}
          margin="normal"
          multiline
          rows={3}
          helperText="Detailed explanation of this AI initiative/capability"
        />

        <TextField
          fullWidth
          label="Current Maturity Score Justification"
          value={formData.currentScoreJustification}
          onChange={handleInputChange('currentScoreJustification')}
          margin="normal"
          multiline
          rows={3}
          helperText="Explain why this card is currently placed at this maturity level"
        />

        <TextField
          fullWidth
          label="Next Steps/Recommendations"
          value={formData.nextStepsRecommendations}
          onChange={handleInputChange('nextStepsRecommendations')}
          margin="normal"
          multiline
          rows={3}
          helperText="What needs to be done to move this initiative to the next maturity level"
        />

        <TextField
          fullWidth
          label="Relevant Link"
          value={formData.relevantLink}
          onChange={handleInputChange('relevantLink')}
          margin="normal"
          helperText="URL to relevant documentation or resources"
        />

        {/* Timestamps */}
        {card.createdAt && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(card.createdAt).toLocaleString()}
            </Typography>
            {card.updatedAt && card.updatedAt !== card.createdAt && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                Updated: {new Date(card.updatedAt).toLocaleString()}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleDelete}
          color="error"
          startIcon={<Delete />}
          disabled={updating || deleting}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Button onClick={onClose} disabled={updating || deleting}>
          Cancel
        </Button>
        <Button 
          onClick={handleUpdate} 
          variant="contained"
          disabled={updating || deleting || !formData.title.trim()}
        >
          {updating ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CardDetailsModal; 