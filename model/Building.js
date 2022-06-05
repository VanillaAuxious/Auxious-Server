const mongoose = require("mongoose");

const buildingSchema = mongoose.Schema({
  picture: {
    type: [String],
  },
  auctionNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  buildingType: {
    type: String,
    enum: ['아파트', '주택', '다세대/다가구', '오피스텔/원룸'],
    default: '아파트',
    required: true,
  },
  squareMeters: {
    type: String,
    required: true,
  },
  connoisseur: {
    type: String,
    required: true,
  },
  lowestPrice: {
    type: String,
  },
  deposit: String,
  process: {
    type: [Object],
    default: null,
  },
  tenants: {
    type: [Object],
    default: null,
  },
  causional: {
    type: [Object],
    default: null,
  },
  appraisal: {
    type: String,
    default: null,
  },
  coords: {
  }
}, {
  timestamps: true,
});

const Building = mongoose.model("Building", buildingSchema)

module.exports = Building;

