const mongoose = require("mongoose");

const buildingSchema = mongoose.Schema({
  picture: {
    type: String,
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
    type: Number,
    required: true,
  },
  lowestPrice: {
    type: Number,
  },
  deposit: Number,
  process: {
    type: [String],
    default: null,
  },
  tenants: {
    type: [String],
    default: null,
  },
  causional: {
    type: [String],
    default: null,
  },
  appraisal: {
    type: String,
    default: null,
  },
  coords: {
    type: "Point",
    coordinates: [x, y],
    required: true,
  }
}, {
  timestamps: true,
});

const Building = mongoose.model("Building", buildingSchema)

module.exports = Building;
