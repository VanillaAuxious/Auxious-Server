require('dotenv').config();

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../model/User');

describe('users', () => {
  let userId, testUser, serverToken;

  beforeAll(async () => {
    await connectDB();

    testUser = await new User({
      username: 'test',
      email: 'test1@test',
      profileImage: null,
      description: 'hi',
      favoriteBuildings: ['62a922e07af44bcc695075c3'],
      favoriteRegions: ['삼성동'],
      currentDeviceToken: '',
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
    userId = testUser = serverToken = null;

    await disconnectDB();
  });

  describe('/user', () => {
    it('GET', async () => {
      const response = await request(app)
        .get('/api/users/user')
        .set('Cookie', [`server_token=${serverToken}`])
        .expect(200)
        .expect('Content-Type', /json/i);

      console.log(response.body);
      expect(response.body);
    });
  });
});
