require('dotenv').config();

const request = require('supertest');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../model/User');

describe('users', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });
});
