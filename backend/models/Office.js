const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an office name'],
    trim: true
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  hours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  contact: {
    type: String
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }]
}, {
  timestamps: true
});

officeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Office', officeSchema);
