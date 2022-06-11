const asyncCatcher = require('../utils/asyncCatcher');
const CustomeError = require('../utils/CustomError');

const Building = require('../model/Building');

const { getTargetBuilding } = require('../services/buildingService');
const { getCoordsFromAddress } = require('../utils/helpers');
const { BUILDING_DOES_NOT_EXIST } = require('../constants/errorConstants');

const getBuildingInfo = asyncCatcher(async (req, res, next) => {
  const { buildingId } = req.params;
  const building = await getTargetBuilding(buildingId);

  if (!building) {
    return next(new CustomeError(BUILDING_DOES_NOT_EXIST));
  }

  res.json({
    ok: true,
    status: 200,
    buildingInfo: building,
  });
});

const getBuildingsOnMap = asyncCatcher(async (req, res, next) => {
  let { coords, 'max-distance': maxDistance } = req.query;
  const x = Number(coords.split(',')[0]);
  const y = Number(coords.split(',')[1]);
  maxDistance = Number(maxDistance);

  const auctions = await Building.find({
    coords: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [y, x],
        },
        $maxDistance: maxDistance,
      },
    },
  });

  return res.json({
    ok: true,
    status: 200,
    auctions: auctions,
  });
});

module.exports = {
  getBuildingInfo,
  getBuildingsOnMap,
};
