
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

addNewLaunch(launch);
launches.get(100) === launch;

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function getAllLaunches() {
  return Array.from(launches.values());
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