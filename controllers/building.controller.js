const asyncCatcher = require('../utils/asyncCatcher');
const CustomeError = require('../utils/CustomError');

const { getTargetBuilding } = require('../services/buildingService');
const { BUILDING_DOES_NOT_EXIST } = require('../constants/errorConstants');

const getBuildingInfo = asyncCatcher(async (req, res, next) => {
  const buildingId = req.params.buildingId;
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

module.exports = {
  getBuildingInfo,
};
