const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mineurSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    motdepasse: {
      type: String,
      required: true
    },
    niveau: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mineur', mineurSchema);
