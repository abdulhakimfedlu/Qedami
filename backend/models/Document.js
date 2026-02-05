const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a document name'],
    trim: true
  },
  description: {
    type: String
  },
  isOriginalRequired: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Deprecated'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
