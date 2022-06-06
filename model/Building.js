const mongoose = require('mongoose');

const ProcessSubSchema = mongoose.Schema({
  dayProcess: String,
  progress: String,
  date: String,
});

const TenantsSubSchema = mongoose.Schema({
  tenantName: String,
  location: String,
  date: String,
});

const BuildingSchema = mongoose.Schema(
  {
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

    process: [ProcessSubSchema],

    tenants: [TenantsSubSchema],

    caution: String,

    appraisal: {
      type: String,
      default: null,
    },
    coords: {
      type: Point,
      coordinates: Array,
      index: '2dsphere',
    },
  },
  {
    timestamps: true,
  },
);

const Building = mongoose.model('Building', BuildingSchema);

module.exports = Building;
