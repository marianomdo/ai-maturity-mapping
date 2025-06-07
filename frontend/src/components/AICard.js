import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button
} from '@mui/material';
import { DragIndicator, ExpandMore, ExpandLess } from '@mui/icons-material';

function AICard({ card, index, onClick }) {
  const [expanded, setExpanded] = useState(false);
  
  const maxLength = 50; // Characters to show before "view more"
  const shouldTruncate = card.description && card.description.length > maxLength;
  const displayDescription = expanded || !shouldTruncate 
    ? card.description 
    : card.description?.substring(0, maxLength) + '...';

  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            width: '100%',
            height: 'fit-content',
            maxHeight: { xs: '55px', md: '110px' },
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            backgroundColor: snapshot.isDragging ? '#EDE8F5' : '#FFFFFF',
            border: `2px solid ${snapshot.isDragging ? '#3D52A0' : '#ADBBDA'}`,
            borderRadius: 2,
            boxShadow: snapshot.isDragging 
              ? '0 8px 16px rgba(61,82,160,0.3)' 
              : '0 2px 4px rgba(0,0,0,0.1)',
            transform: snapshot.isDragging ? 'rotate(3deg)' : 'none',
            transition: snapshot.isDragging ? 'none' : 'all 0.2s ease',
            overflow: 'hidden',
            '&:hover': {
              borderColor: '#7091E6',
              boxShadow: '0 4px 8px rgba(112,145,230,0.2)',
              transform: 'translateY(-1px)'
            }
          }}
          onClick={(e) => {
            // Only trigger onClick if not actively dragging
            if (!snapshot.isDragging) {
              onClick();
            }
          }}
        >
          <CardContent sx={{ 
            p: { xs: 0.25, md: 1 }, 
            '&:last-child': { pb: { xs: 0.25, md: 1 } },
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box display="flex" alignItems="center" gap={0.25} mb={{ xs: 0, md: 0.5 }}>
              <Box sx={{ color: '#3D52A0', flexShrink: 0 }}>
                <DragIndicator sx={{ fontSize: { xs: '0.7rem', md: '1.2rem' } }} />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  flexGrow: 1,
                  fontWeight: 'bold',
                  color: '#3D52A0',
                  fontSize: { xs: '0.6rem', md: '0.875rem' },
                  lineHeight: 1.1,
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: { xs: 1, md: 2 },
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {card.title}
              </Typography>
            </Box>
            
            {/* Hide description on mobile due to space constraints */}
            {card.description && (
              <Box sx={{ flexGrow: 1, overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
                <Typography 
                  variant="caption" 
                  sx={{
                    color: '#7091E6',
                    fontSize: { xs: '0.55rem', md: '0.75rem' },
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    display: 'block'
                  }}
                >
                  {displayDescription}
                </Typography>
                
                {shouldTruncate && (
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(!expanded);
                    }}
                    sx={{
                      minWidth: 'auto',
                      p: 0,
                      color: '#8697C4',
                      fontSize: { xs: '0.5rem', md: '0.7rem' },
                      textTransform: 'none',
                      mt: 0.25
                    }}
                    endIcon={expanded ? <ExpandLess sx={{ fontSize: { xs: '0.6rem', md: '0.8rem' } }} /> : <ExpandMore sx={{ fontSize: { xs: '0.6rem', md: '0.8rem' } }} />}
                  >
                    {expanded ? 'Less' : 'More'}
                  </Button>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}

export default AICard; 