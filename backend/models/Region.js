const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a region name'],
    unique: true
  },
  offices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Region', regionSchema);
