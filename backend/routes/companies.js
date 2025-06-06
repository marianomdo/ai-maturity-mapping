const express = require('express');
const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
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

    const company = new Company({
      name: req.body.name
    });

    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    if (error.code === 11000) {
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

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Company name already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 