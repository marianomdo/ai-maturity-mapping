const mongoose = require('mongoose');

const aiCardSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  categoryName: {
    type: String,
    required: true,
    enum: ['Data Foundation', 'AI Strategy', 'Talent & Culture', 'Technology & Tools']
  },
  levelName: {
    type: String,
    required: true,
    enum: ['Level 0: Nascent', 'Level 1: Foundational', 'Level 2: Developing', 'Level 3: Operationalized', 'Level 4: Optimized']
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: '',
    maxlength: 2000
  },
  currentScoreJustification: {
    type: String,
    default: '',
    maxlength: 2000
  },
  nextStepsRecommendations: {
    type: String,
    default: '',
    maxlength: 2000
  },
  relevantLink: {
    type: String,
    default: '',
    maxlength: 500
  }
}, {
  timestamps: true
});

// Create index for efficient querying
aiCardSchema.index({ companyId: 1, categoryName: 1, levelName: 1 });

module.exports = mongoose.model('AICard', aiCardSchema); 