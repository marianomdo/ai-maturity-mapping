import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';

function CompanySelector({ companies, selectedCompany, onCompanySelect, onCompanyCreate }) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateSubmit = async () => {
    if (!newCompanyName.trim()) {
      setError('Company name is required');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await onCompanyCreate({ name: newCompanyName.trim() });
      setCreateDialogOpen(false);
      setNewCompanyName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateCancel = () => {
    setCreateDialogOpen(false);
    setNewCompanyName('');
    setError(null);
  };

  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          color: '#3D52A0',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          mb: 3
        }}
      >
        Company Selection
      </Typography>
      
      <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel sx={{ color: '#7091E6' }}>Select Company</InputLabel>
          <Select
            value={selectedCompany?.id || ''}
            label="Select Company"
            onChange={(e) => {
              const company = companies.find(c => c.id === e.target.value);
              onCompanySelect(company);
            }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ADBBDA'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#7091E6'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3D52A0'
              }
            }}
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #3D52A0 0%, #7091E6 100%)',
            boxShadow: '0 4px 12px rgba(61,82,160,0.4)',
            borderRadius: 2,
            px: 3,
            py: 1,
            '&:hover': {
              background: 'linear-gradient(135deg, #7091E6 0%, #8697C4 100%)',
              boxShadow: '0 6px 16px rgba(61,82,160,0.5)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Add Company
        </Button>
      </Box>

      {selectedCompany && (
        <Typography 
          variant="body1" 
          sx={{ 
            mt: 3,
            p: 2,
            background: 'linear-gradient(135deg, rgba(237,232,245,0.7) 0%, rgba(173,187,218,0.5) 100%)',
            borderRadius: 2,
            color: '#3D52A0',
            border: '1px solid rgba(173,187,218,0.3)'
          }}
        >
          Currently viewing AI maturity board for: <strong>{selectedCompany.name}</strong>
        </Typography>
      )}

      <Dialog open={createDialogOpen} onClose={handleCreateCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Company</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Company Name"
            fullWidth
            variant="outlined"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateSubmit();
              }
            }}
            disabled={creating}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateCancel} disabled={creating}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateSubmit} 
            variant="contained"
            disabled={creating || !newCompanyName.trim()}
          >
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CompanySelector; 