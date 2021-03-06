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

const ForSaleSchema = mongoose.Schema({
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

module.exports = mongoose.model('ForSale', ForSaleSchema);
