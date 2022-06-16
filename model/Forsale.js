const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const ForsaleSchema = mongoose.Schema({
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
    type: pointSchema,
    index: '2dsphere',
  },
});
= mongoose.model('ForSale', ForSaleSchema);

module.exports = mongoose.model('Forsale', ForsaleSchema);
