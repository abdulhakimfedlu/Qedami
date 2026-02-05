const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  serviceType: {
    type: String
  },
  requirements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  checklist: [{
    step: String,
    description: String
  }],
  offices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office'
  }],
  forms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form'
  }],
  availabilityNotes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
