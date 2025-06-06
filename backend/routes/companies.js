const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM companies ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM companies WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new company
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Company name must be between 1 and 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const result = await pool.query(
      'INSERT INTO companies (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // unique_violation
      return res.status(400).json({ message: 'Company name already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update company
router.put('/:id', [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Company name must be between 1 and 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const result = await pool.query(
      'UPDATE companies SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [name, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // unique_violation
      return res.status(400).json({ message: 'Company name already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM companies WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 