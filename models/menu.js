const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chef',
    required: true,
  },
  type: {
    type: String,
    enum: ['dinner', 'déjuner'],
    required: true,
  },
  platEntrer: {
    type: String,
    required: true,
  },
  platPrincipal: {
    type: String,
    required: true,
  },
  dessert: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Menu', menuSchema);
