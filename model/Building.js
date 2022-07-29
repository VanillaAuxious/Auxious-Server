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
    /** connoisseur는 감정가(감정하는 사람)라는 뜻입니다. 감정 가격이라는 뜻인줄 알고 프로퍼티 이름을 초기에 잘못 지었습니다.
     * 현재 크롤렁 대상 사이트의 robots.txt에 크롤링 허용 여부가 disallowed로 변경되고 사이트 HTML 구조가 바뀌어서 이름을 바꿀 수가 없는 상황입니다.
     * (기존 데이터를 지우고 이름을 바꿔서 새로 크롤링 하는것이 불가능합니다.)
     * 감정가(Appraised Price)라는 뜻으로 이해해주시면 감사하겠습니다.
     */
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
      type: pointSchema,
      index: '2dsphere',
    },
    user: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Building', BuildingSchema);
