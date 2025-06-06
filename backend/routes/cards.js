const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const router = express.Router();

// Get all cards for a company
router.get('/company/:companyId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ac.*, c.name as company_name 
      FROM ai_cards ac 
      JOIN companies c ON ac.company_id = c.id 
      WHERE ac.company_id = $1 
      ORDER BY ac.category_name, ac.level_name
    `, [req.params.companyId]);
    
    // Transform all cards from snake_case to camelCase
    const transformedCards = result.rows.map(card => ({
      id: card.id,
      companyId: card.company_id,
      categoryName: card.category_name,
      levelName: card.level_name,
      title: card.title,
      description: card.description,
      currentScoreJustification: card.current_score_justification,
      nextStepsRecommendations: card.next_steps_recommendations,
      relevantLink: card.relevant_link,
      companyName: card.company_name,
      createdAt: card.created_at,
      updatedAt: card.updated_at
    }));
    
    res.json(transformedCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get card by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ac.*, c.name as company_name 
      FROM ai_cards ac 
      JOIN companies c ON ac.company_id = c.id 
      WHERE ac.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    
    // Transform snake_case to camelCase for frontend
    const card = result.rows[0];
    const transformedCard = {
      id: card.id,
      companyId: card.company_id,
      categoryName: card.category_name,
      levelName: card.level_name,
      title: card.title,
      description: card.description,
      currentScoreJustification: card.current_score_justification,
      nextStepsRecommendations: card.next_steps_recommendations,
      relevantLink: card.relevant_link,
      companyName: card.company_name,
      createdAt: card.created_at,
      updatedAt: card.updated_at
    };
    
    res.json(transformedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new card
router.post('/', [
  body('companyId').isInt({ min: 1 }).withMessage('Valid company ID is required'),
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
    const companyCheck = await pool.query('SELECT id FROM companies WHERE id = $1', [req.body.companyId]);
    if (companyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const {
      companyId,
      categoryName,
      levelName,
      title,
      description = '',
      currentScoreJustification = '',
      nextStepsRecommendations = '',
      relevantLink = ''
    } = req.body;

    const result = await pool.query(`
      INSERT INTO ai_cards (
        company_id, category_name, level_name, title, description, 
        current_score_justification, next_steps_recommendations, relevant_link
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `, [companyId, categoryName, levelName, title, description, currentScoreJustification, nextStepsRecommendations, relevantLink]);

    // Get the card with company name
    const cardWithCompany = await pool.query(`
      SELECT ac.*, c.name as company_name 
      FROM ai_cards ac 
      JOIN companies c ON ac.company_id = c.id 
      WHERE ac.id = $1
    `, [result.rows[0].id]);
    
    // Transform snake_case to camelCase for frontend
    const card = cardWithCompany.rows[0];
    const transformedCard = {
      id: card.id,
      companyId: card.company_id,
      categoryName: card.category_name,
      levelName: card.level_name,
      title: card.title,
      description: card.description,
      currentScoreJustification: card.current_score_justification,
      nextStepsRecommendations: card.next_steps_recommendations,
      relevantLink: card.relevant_link,
      companyName: card.company_name,
      createdAt: card.created_at,
      updatedAt: card.updated_at
    };
    
    res.status(201).json(transformedCard);
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

    const updates = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        const dbField = key === 'companyId' ? 'company_id' : 
                       key === 'categoryName' ? 'category_name' :
                       key === 'levelName' ? 'level_name' :
                       key === 'currentScoreJustification' ? 'current_score_justification' :
                       key === 'nextStepsRecommendations' ? 'next_steps_recommendations' :
                       key === 'relevantLink' ? 'relevant_link' : key;
        
        updates.push(`${dbField} = $${paramIndex}`);
        values.push(req.body[key]);
        paramIndex++;
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);

    const result = await pool.query(`
      UPDATE ai_cards 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Get the card with company name
    const cardWithCompany = await pool.query(`
      SELECT ac.*, c.name as company_name 
      FROM ai_cards ac 
      JOIN companies c ON ac.company_id = c.id 
      WHERE ac.id = $1
    `, [result.rows[0].id]);

    // Transform snake_case to camelCase for frontend
    const card = cardWithCompany.rows[0];
    const transformedCard = {
      id: card.id,
      companyId: card.company_id,
      categoryName: card.category_name,
      levelName: card.level_name,
      title: card.title,
      description: card.description,
      currentScoreJustification: card.current_score_justification,
      nextStepsRecommendations: card.next_steps_recommendations,
      relevantLink: card.relevant_link,
      companyName: card.company_name,
      createdAt: card.created_at,
      updatedAt: card.updated_at
    };

    res.json(transformedCard);
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

    const { categoryName, levelName } = req.body;
    const result = await pool.query(`
      UPDATE ai_cards 
      SET category_name = $1, level_name = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $3 
      RETURNING *
    `, [categoryName, levelName, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Get the card with company name
    const cardWithCompany = await pool.query(`
      SELECT ac.*, c.name as company_name 
      FROM ai_cards ac 
      JOIN companies c ON ac.company_id = c.id 
      WHERE ac.id = $1
    `, [result.rows[0].id]);

    // Transform snake_case to camelCase for frontend
    const card = cardWithCompany.rows[0];
    const transformedCard = {
      id: card.id,
      companyId: card.company_id,
      categoryName: card.category_name,
      levelName: card.level_name,
      title: card.title,
      description: card.description,
      currentScoreJustification: card.current_score_justification,
      nextStepsRecommendations: card.next_steps_recommendations,
      relevantLink: card.relevant_link,
      companyName: card.company_name,
      createdAt: card.created_at,
      updatedAt: card.updated_at
    };

    res.json(transformedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete card
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM ai_cards WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 