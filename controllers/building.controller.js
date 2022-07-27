const asyncCatcher = require('../utils/asyncCatcher');
const CustomError = require('../utils/CustomError');

const Building = require('../model/Building');
const ForSale = require('../model/ForSale');

const { getTargetBuilding } = require('../services/buildingService');
const { BUILDING_DOES_NOT_EXIST } = require('../constants/errorConstants');

const getBuildingInfo = asyncCatcher(async (req, res, next) => {
  const { buildingId } = req.params;
  const building = await getTargetBuilding(buildingId);

  if (!building) {
    return next(new CustomError(BUILDING_DOES_NOT_EXIST));
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

  const forSales = await ForSale.find({
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
    forSales: forSales,
  });
});

const getAuctions = asyncCatcher(async (req, res, next) => {
  const auctions = await Building.find({});

  if (!auctions) {
    return next(new CustomError(BUILDING_DOES_NOT_EXIST));
  }

  res.json({
    ok: true,
    status: 200,
    auctions: auctions,
  });
});

module.exports = {
  getAuctions,
  getBuildingInfo,
  getBuildingsOnMap,
};
