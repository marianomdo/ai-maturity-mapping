const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 200
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema); 