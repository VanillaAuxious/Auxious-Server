require('dotenv').config();

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../model/User');
const Building = require('../model/Building');

describe('users', () => {
  let userId, buildingId, testUser, testBuilding, serverToken;

  beforeAll(async () => {
    await connectDB();

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

    buildingId = testBuilding._id;

    testUser = await new User({
      username: 'test',
      email: 'test1@test',
      profileImage: null,
      description: 'hi',
      favoriteBuildings: [buildingId],
      favoriteRegions: ['삼성동'],
      currentDeviceToken: 'testdevicetoken',
      contract: [],
    }).save();

    userId = testUser._id;
    serverToken = jwt.sign(
      testUser._id.toHexString(),
      process.env.TOKEN_SECRET,
    );
  });

  afterAll(async () => {
    await User.findByIdAndDelete(userId);
    userId = testUser = buildingId = testBuilding = serverToken = null;

    await disconnectDB();
  });

  describe('/user', () => {
    it('GET', async () => {
      const response = await request(app)
        .get('/api/users/user')
        .set('Cookie', [`server_token=${serverToken}`])
        .expect(200)
        .expect('Content-Type', /json/i);

      expect(response.body.ok).toEqual(true);
      expect(response.body.status).toEqual(200);
      expect(response.body.userInfo.username).toEqual(testUser.username);
      expect(response.body.userInfo.favoriteRegions).toContain('삼성동');
    });

    it('PATCH', async () => {
      const response = await request(app)
        .patch('/api/users/user')
        .set('Cookie', [`server_token=${serverToken}`])
        .send({ fieldName: 'description', newFieldData: 'hello' })
        .expect(200)
        .expect('Content-Type', /json/i);

      const targetUser = await User.findById(userId);

      expect(response.body.ok).toEqual(true);
      expect(response.body.status).toEqual(200);
      expect(response.body.updatedData).toEqual(targetUser.description);

      const newResponse = await request(app)
        .patch('/api/users/user')
        .set('Cookie', [`server_token=${serverToken}`])
        .send({ fieldName: 'description', newFieldData: 'hi' })
        .expect(200)
        .expect('Content-Type', /json/i);

      const newTargetUser = await User.findById(userId);

      expect(newTargetUser.description).toEqual('hi');
      expect(newResponse.body.updatedData).toEqual(newTargetUser.description);
    });
  });

  describe('/user/favorites/buildings', () => {
    it('GET', async () => {
      const response = await request(app)
        .get('/api/users/user/favorites/buildings')
        .set('Cookie', [`server_token=${serverToken}`])
        .expect(200)
        .expect('Content-Type', /json/i);

      const testFavoriteBuilding = response.body.favoriteBuildingsInfoArray[0];

      expect(response.body.ok).toEqual(true);
      expect(response.body.status).toEqual(200);
      expect(testFavoriteBuilding.auctionNumber).toEqual(
        testBuilding.auctionNumber,
      );
    });

    it('POST', async () => {
      await User.findByIdAndUpdate(userId, {
        $pull: {
          favoriteBuildings: buildingId,
        },
      });

      const targetUser = await User.findById(userId);
      expect(targetUser.favoriteBuildings).toHaveLength(0);

      const response = await request(app)
        .post('/api/users/user/favorites/buildings')
        .set('Cookie', [`server_token=${serverToken}`])
        .send({ buildingId })
        .expect(200)
        .expect('Content-Type', /json/i);

      const currentTargetUser = await User.findById(userId);

      expect(response.body.ok).toEqual(true);
      expect(response.body.status).toEqual(201);
      expect(currentTargetUser.favoriteBuildings[0]).toEqual(buildingId);
    });
  });

  describe('/user/favorites/regions', () => {
    it('GET', async () => {
      const response = await request(app)
        .get('/api/users/user/favorites/regions')
        .set('Cookie', [`server_token=${serverToken}`])
        .expect(200)
        .expect('Content-Type', /json/i);

      expect(response.body.ok).toEqual(true);
      expect(response.body.status).toEqual(200);
      expect(response.body.favoriteRegions).toEqual(testUser.favoriteRegions);
    });

    it('POST', async () => {
      const response = await request(app)
        .post('/api/users/user/favorites/regions')
        .set('Cookie', [`server_token=${serverToken}`])
        .send({ region: '역삼동' })
        .expect(200)
        .expect('Content-Type', /json/i);

      const targetUser = await User.findById(userId);

      expect(response.body.ok).toEqual(true);
      expect(response.body.status).toEqual(201);
      expect(targetUser.favoriteRegions).toContain('역삼동');
    });
  });

  describe('/user/favorites/buildings/:buildingId', () => {
    it('DELETE', async () => {
      const response = await request(app)
        .delete(`/api/users/user/favorites/buildings/${buildingId}`)
        .set('Cookie', [`server_token=${serverToken}`])
        .expect(200)
        .expect('Content-Type', /json/i);

      const targetUser = await User.findById(userId);

      expect(response.body.ok).toEqual(true);
      expect(response.body.status).toEqual(200);
      expect(response.body.deletedId).toEqual(buildingId.toHexString());
      expect(targetUser.favoriteBuildings).not.toContain(buildingId);
    });
  });

  describe('/user/favorites/regions/:regionName', () => {
    it('DELETE', async () => {
      const response = await request(app)
        .delete(`/api/users/user/favorites/regions/${encodeURI('역삼동')}`)
        .set('Cookie', [`server_token=${serverToken}`])
        .expect(200)
        .expect('Content-Type', /json/i);

      const targetUser = await User.findById(userId);

      expect(response.body.ok).toEqual(true);
      expect(response.body.status).toEqual(200);
      expect(response.body.deletedRegion).toEqual('역삼동');
      expect(targetUser.favoriteRegions).not.toContain('역삼동');
    });
  });

  describe('/user/device-token', () => {
    it('DELETE', async () => {
      const response = await request(app)
        .delete('/api/users/user/device-token')
        .set('Cookie', [`server_token=${serverToken}`])
        .expect(200)
        .expect('Content-Type', /json/i);

      const targetUser = await User.findById(userId);

      expect(response.body.ok).toEqual(true);
      expect(response.body.status).toEqual(200);
      expect(targetUser.currentDeviceToken).toEqual('');
    });
  });
});
