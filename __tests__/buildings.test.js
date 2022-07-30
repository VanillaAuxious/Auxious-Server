require('dotenv').config();

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../model/User');
const Building = require('../model/Building');
const Forsale = require('../model/ForSale');

describe('buildings', () => {
  let serverToken,
    userId,
    buildingId,
    forsaleId,
    testBuilding,
    testUser,
    testForsale;

  beforeAll(async () => {
    await connectDB();

    testUser = await new User({
      username: 'test',
      email: 'test@test',
      profileImage: null,
      description: 'hi',
      favoriteBuildings: ['62a922e07af44bcc695075c3'],
      favoriteRegions: ['삼성동'],
      currentDeviceToken: '',
      contract: [],
    }).save();

    testBuilding = await new Building({
      picture: [],
      auctionNumber: '2022테스트 123',
      address: '서울특별시 동작구',
      buildingType: '주택',
      squareMeters: '6.6 2.90',
      connoisseur: '61,216,600원',
      lowestPrice: '↓ 80% 48,973,000 원',
      deposit: '(10%) 4,897,300원',
      process: [
        {
          dayProcess: '1일',
          progress: '경매사건접수',
          date: '2019.12.12',
        },
      ],
      tenants: [
        {
          tenantName: '주OOOO',
          location: '미상',
          date: '2018. 11. 30.',
        },
      ],
      caution: '',
      appraisal: `
        [구분건물]
        본건은 서울특별시 금천구 독산동 소재 "난곡중학교" 서측 인근에 위치하며 주위는 단독 주택, 다세대주택, 아파트단지, 근린생활시설, 학교 등이 혼재하며 주위환경은 보통임.
        본건까지 차량진출입이 가능하며 인근에 노선버스정류장이 소재하는 등 대중교통사정은 보통임.
        철근콘크리트조 평스라브지붕 5층 건물중 4층 401호로서외벽 : 석재붙임 및 드라이비트 마감 등내벽 : 벽지 및 일부타일 마감창호 : 샷시 창호임.
        다세대주택(별지 "호별배치도 및 내부구조도" 참조)으로 이용중임.
        도시가스에 의한 개별난방설비, 위생급배수설비, 주차장설비, 승강기설비, 자동개폐문설비 등이 되어있음.
        본건 남서측으로 노폭 6m 내외의 포장도로와 각각 접함.
      `,
      coords: {
        type: 'Point',
        coordinates: [126.942926504, 37.510859948],
      },
    }).save();

    testForsale = await new Forsale({
      name: '테스트 1동',
      address: '서울특별시 동작구',
      squareMeters: '9.04B평 / 7.90평',
      price: '33,000,000 원',
      coords: {
        type: 'Point',
        coordinates: [126.94291, 37.51086],
      },
    }).save();

    userId = testUser._id;
    buildingId = testBuilding._id;
    forsaleId = testForsale._id;

    serverToken = jwt.sign(
      testUser._id.toHexString(),
      process.env.TOKEN_SECRET,
    );
  });

  afterAll(async () => {
    await User.findByIdAndDelete(userId);
    await Building.findByIdAndDelete(buildingId);
    await Forsale.findByIdAndDelete(forsaleId);

    userId =
      buildingId =
      forsaleId =
      serverToken =
      testUser =
      testBuilding =
      testForsale =
        null;

    await disconnectDB();
  });

  it('GET /api/buildings', async () => {
    const response = await request(app)
      .get(
        `/api/buildings?coords=${testBuilding.coords.coordinates[1]},${testBuilding.coords.coordinates[0]}&max-distance=10`,
      )
      .set('Cookie', [`server_token=${serverToken}`])
      .expect(200)
      .expect('Content-Type', /json/i);

    const auctions = response.body.auctions;
    const forsales = response.body.forSales;

    expect(response.body.ok).toEqual(true);
    expect(response.body.status).toEqual(200);
    expect(auctions[auctions.length - 1].auctionNumber).toEqual(
      testBuilding.auctionNumber,
    );
    expect(forsales[forsales.length - 1].name).toEqual(testForsale.name);
  });

  it('GET /api/buildings/auctions', async () => {
    const response = await request(app)
      .get(`/api/buildings/auctions`)
      .set('Cookie', [`server_token=${serverToken}`])
      .expect(200)
      .expect('Content-Type', /json/i);

    const auctions = response.body.auctions;

    expect(response.body.ok).toEqual(true);
    expect(response.body.status).toEqual(200);
    expect(auctions[auctions.length - 1].auctionNumber).toEqual(
      testBuilding.auctionNumber,
    );
  });

  it('GET /api/buildings/:buildingId', async () => {
    const response = await request(app)
      .get(`/api/buildings/${buildingId}`)
      .set('Cookie', [`server_token=${serverToken}`])
      .expect(200)
      .expect('Content-Type', /json/i);

    expect(response.body.ok).toEqual(true);
    expect(response.body.status).toEqual(200);
    expect(response.body.buildingInfo.auctionNumber).toEqual(
      testBuilding.auctionNumber,
    );
    expect(response.body.buildingInfo.buildingType).toEqual(
      testBuilding.buildingType,
    );
  });
});
