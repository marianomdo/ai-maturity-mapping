const express = require('express');
const { body, validationResult } = require('express-validator');
const AICard = require('../models/AICard');
const Company = require('../models/Company');
const router = express.Router();

// Get all cards for a company
router.get('/company/:companyId', async (req, res) => {
  try {
    const cards = await AICard.find({ companyId: req.params.companyId })
      .populate('companyId', 'name')
      .sort({ categoryName: 1, levelName: 1 });
    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get card by ID
router.get('/:id', async (req, res) => {
  try {
    const card = await AICard.findById(req.params.id).populate('companyId', 'name');
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new card
router.post('/', [
  body('companyId').isMongoId().withMessage('Valid company ID is required'),
  body('categoryName')
    .isIn(['Data Foundation', 'AI Strategy', 'Talent & Culture', 'Technology & Tools'])
    .withMessage('Invalid category name'),
  body('levelName')
    .isIn(['Level 0: Nascent', 'Level 1: Foundational', 'Level 2: Developing', 'Level 3: Operationalized', 'Level 4: Optimized'])
    .withMessage('Invalid level name'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('currentScoreJustification').optional().isLength({ max: 2000 }).withMessage('Justification must be less than 2000 characters'),
  body('nextStepsRecommendations').optional().isLength({ max: 2000 }).withMessage('Recommendations must be less than 2000 characters'),
  body('relevantLink').optional().isLength({ max: 500 }).withMessage('Link must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify company exists
    const company = await Company.findById(req.body.companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const card = new AICard(req.body);
    const savedCard = await card.save();
    await savedCard.populate('companyId', 'name');
    
    res.status(201).json(savedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update card
router.put('/:id', [
  body('categoryName')
    .optional()
    .isIn(['Data Foundation', 'AI Strategy', 'Talent & Culture', 'Technology & Tools'])
    .withMessage('Invalid category name'),
  body('levelName')
    .optional()
    .isIn(['Level 0: Nascent', 'Level 1: Foundational', 'Level 2: Developing', 'Level 3: Operationalized', 'Level 4: Optimized'])
    .withMessage('Invalid level name'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('currentScoreJustification').optional().isLength({ max: 2000 }).withMessage('Justification must be less than 2000 characters'),
  body('nextStepsRecommendations').optional().isLength({ max: 2000 }).withMessage('Recommendations must be less than 2000 characters'),
  body('relevantLink').optional().isLength({ max: 500 }).withMessage('Link must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const card = await AICard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('companyId', 'name');

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update card position (for drag and drop)
router.patch('/:id/position', [
  body('categoryName')
    .isIn(['Data Foundation', 'AI Strategy', 'Talent & Culture', 'Technology & Tools'])
    .withMessage('Invalid category name'),
  body('levelName')
    .isIn(['Level 0: Nascent', 'Level 1: Foundational', 'Level 2: Developing', 'Level 3: Operationalized', 'Level 4: Optimized'])
    .withMessage('Invalid level name')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const card = await AICard.findByIdAndUpdate(
      req.params.id,
      { 
        categoryName: req.body.categoryName,
        levelName: req.body.levelName
      },
      { new: true, runValidators: true }
    ).populate('companyId', 'name');

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete card
router.delete('/:id', async (req, res) => {
  try {
    const card = await AICard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 