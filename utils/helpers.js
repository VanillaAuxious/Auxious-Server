const axios = require('axios');
const xml2js = require('xml2js');

async function getCoordsFromAddress(address) {
  const key = process.env.GEOCODER_KEY;
  const uri = encodeURI(
    `http://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326&address=${address}&refine=true&simple=false&format=xml&type=road&key=${key}`,
  );

  const point = await axios.get(uri);
  const coords = [];

  xml2js.parseString(point.data, (err, result) => {
    const json = JSON.stringify(result, null, 4);
    const resStatus = JSON.parse(json).response.status;

    if (resStatus[0] !== 'OK') {
      return null;
    }

    const x = JSON.parse(json).response.result[0].point[0].x[0];
    const y = JSON.parse(json).response.result[0].point[0].y[0];
    coords.push(y, x);
  });

  return coords;
}

module.exports = {
  getCoordsFromAddress,
};
