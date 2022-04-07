const launchesDatabase = require('./launches.mongo');
const { getPlanet } = require('./planets.model');

const DEFAULT_FLIGHT_NUMBER = 100

const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM','NASA'],
  upcoming: true,
  sucess: true
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId
  });
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, {
    '__v': 0,
    '_id': 0
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber');  // Al reves que lo normal - El menos hace que sea descendente

  if(!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  const planet = await getPlanet(launch.target);

  if(!planet) {
    throw new Error('Not matching planet was found on the target');
  }

  await launchesDatabase.findOneAndUpdate({  // A distinto de updateOne este mensaje no guarda en lo que le pasas para crear (no lo muta) lo que guarda directamente en mongo
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true    // insert + update - la idea es si no existe que lo crea, si existe que actualize noma
  })
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {   // El new launch para que sea mas declarativo, pero al launch ya lo muta
    success: true,
    upcoming: true,
    customers: ['ZTM','NASA'],
    flightNumber: newFlightNumber
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted =  await launchesDatabase.updateOne({   
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });

  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById
}