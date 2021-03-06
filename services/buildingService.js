const Building = require('../model/Building');

async function getTargetBuilding(buildingId) {
  if (buildingId) {
    const existBuilding = await Building.findById(buildingId);

    if (!existBuilding) {
      return null;
    }

    return existBuilding;
  }

  return null;
}

module.exports = {
  getTargetBuilding,
};
