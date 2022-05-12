const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    mineurId: {
      type: Schema.Types.ObjectId,
      ref: 'Mineur',
      required: true
    },
    contratId: {
      type: Schema.Types.ObjectId,
      ref: 'Contrat',
      required: true
    },
    estTermine: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
