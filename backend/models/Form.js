const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a form title'],
    trim: true
  },
  description: {
    type: String
  },
  downloadUrl: {
    type: String,
    required: [true, 'Please add a download URL']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Form', formSchema);
