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
          {...provided.dragHandleProps}
          sx={{
            mb: 1,
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            background: snapshot.isDragging 
              ? 'linear-gradient(135deg, rgba(61,82,160,0.9) 0%, rgba(112,145,230,0.7) 100%)' 
              : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 2,
            boxShadow: snapshot.isDragging 
              ? '0 12px 30px rgba(61,82,160,0.4)' 
              : '0 4px 12px rgba(0,0,0,0.1)',
            transform: snapshot.isDragging ? 'rotate(5deg) scale(1.05)' : 'none',
            transition: snapshot.isDragging ? 'none' : 'all 0.2s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(237,232,245,0.9) 100%)',
              boxShadow: '0 8px 20px rgba(61,82,160,0.2)',
              transform: 'translateY(-2px)'
            }
          }}
          onClick={(e) => {
            // Only trigger onClick if not actively dragging
            if (!snapshot.isDragging) {
              onClick();
            }
          }}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{ color: '#3D52A0' }}>
                <DragIndicator fontSize="small" />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  flexGrow: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold',
                  color: '#3D52A0'
                }}
              >
                {card.title}
              </Typography>
            </Box>
            {card.description && (
              <Typography 
                variant="caption" 
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mt: 0.5,
                  color: '#7091E6'
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