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
      <Typography variant="h6" gutterBottom>
        Company Selection
      </Typography>
      
      <Box display="flex" gap={2} alignItems="center">
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Select Company</InputLabel>
          <Select
            value={selectedCompany?._id || ''}
            label="Select Company"
            onChange={(e) => {
              const company = companies.find(c => c._id === e.target.value);
              onCompanySelect(company);
            }}
          >
            {companies.map((company) => (
              <MenuItem key={company._id} value={company._id}>
                {company.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Company
        </Button>
      </Box>

      {selectedCompany && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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