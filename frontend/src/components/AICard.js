import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { DragIndicator } from '@mui/icons-material';

function AICard({ card, index, onClick }) {
  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            mb: 1,
            cursor: 'pointer',
            bgcolor: snapshot.isDragging ? 'action.selected' : 'background.paper',
            transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
          onClick={onClick}
        >
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box {...provided.dragHandleProps}>
                <DragIndicator fontSize="small" color="action" />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  flexGrow: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {card.title}
              </Typography>
            </Box>
            {card.description && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mt: 0.5
                }}
              >
                {card.description}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}

export default AICard; 