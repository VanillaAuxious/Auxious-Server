const { DEV, TEST, PROD } = require('./envConstants');

let GITHUB_CLIENT_ID = null;
let GITHUB_CLIENT_SECRET = null;

if (process.env.ENV === DEV) {
  GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID_LOCAL;
  GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET_LOCAL;
}

if (process.env.ENV === TEST) {
  GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID_TEST;
  GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET_TEST;
}

if (process.env.ENV === PROD) {
  GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID_PROD;
  GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET_PROD;
}

module.exports = {
  ACCESS_TOKEN_URL: `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`,
