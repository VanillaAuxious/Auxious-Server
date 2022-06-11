const mongoose = require('mongoose');

const ForsaleSchema = mongoose.Schema({
  forSalesId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Forsale',
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  squareMeters: {
    type: String,
  },
  price: {
    type: String,
  },
  coords: {
    type: Array,
  },
});

module.exports = mongoose.model('Forsale', ForsaleSchema);
