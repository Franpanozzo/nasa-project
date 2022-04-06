const launchesDatabase = require('./launches.mongo');
const { getPlanet } = require('./planets.model');

const launches = new Map();

let latestFlightNumber = 100;

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

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, {
    '__v': 0,
    '_id': 0
  });
}

async function saveLaunch(launch) {
  const planet = await getPlanet(launch.target);

  if(!planet) {
    throw new Error('Not matching planet was found on the target');
  }

  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  })
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(latestFlightNumber, Object.assign(launch, { 
    flightNumber: latestFlightNumber,  // .assing() le METE las propiedad del obj. pasado como segundo param. al primero, y si las tiene los sobreescribe, devuelve el obj resultado
    customers: ['ZTM','NASA'],
    upcoming: true,
    sucess: true
  })); // Aca seteo lo que yo necesito internamente, los datos que el usuario tiene que estar desacoplado y solo pasarme lo importante
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.sucess = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById
}