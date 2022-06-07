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
  if (!req.params.address) {
    const { coords, 'max-distance': maxDistance, show } = req.query;

    if (show === 'only-auctions') {
      const buildings = await Building.where('coords')
        .near(coords)
        .maxDistance(maxDistance);

      return res.json({
        ok: true,
        status: 200,
        regions: buildings,
      });
    }
  }
});

module.exports = {
  getBuildingInfo,
  getBuildingsOnMap,
};
