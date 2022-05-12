const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contratSchema = new Schema(
  {
    planeteId: {
      type: Schema.Types.ObjectId,
      ref: 'Planete',
      required: true
    },
    prime: {
      type: Number,
      required: true
    },
    danger: {
      type: Number,
      required: true
    },
    ressource: {
      type: String,
      required: true
    },
    quantiteRessource: {
      type: Number,
      required: true
    },
    dateExpiration: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contrat', contratSchema);
