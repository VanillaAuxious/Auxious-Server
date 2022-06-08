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

    const buildings = await Building.find()
      .where('coords')
      .near({
        center: { type: 'Point', coordinates: coords },
        maxDistance,
      });

    if (show === 'only-auctions') {
      return res.json({
        ok: true,
        status: 200,
        regions: buildings,
      });
    }

    // const allForSale = await forSale
    //   .find()
    //   .where('coords')
    //   .near({
    //     center: { type: 'Point', coordinates: coords },
    //     maxDistance,
    //   })

    // return res.json({
    //   ok: true,
    //   status: 200,
    //   regions: [...buildings, ...allForSale]
    // });
  }

  const { address, 'max-distsance': maxDistance, show } = req.query;
  const coords = await getCoordsFromAddress(address);

  const buildings = await Building.find()
    .where('coords')
    .near({
      center: { type: 'Point', coordinates: coords },
      maxDistance,
    });

  if (show === 'only-auctions') {
    return res.json({
      ok: true,
      status: 200,
      regions: buildings,
    });
  }

  // const allForSale = await forSale
  //   .find()
  //   .where('coords')
  //   .near({
  //     center: { type: 'Point', coordinates: coords },
  //     maxDistance,
  //   });

  // return res.json({
  //   ok: true,
  //   status: 200,
  //   regions: [...buildings, ...allForSale],
  // });
});

module.exports = {
  getBuildingInfo,
  getBuildingsOnMap,
};
