const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const { getPlanet } = require('./planets.model');

const DEFAULT_FLIGHT_NUMBER = 100

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  });

  if (firstLaunch) {
    console.log('Launch data already loaded');
  } else {
    await populateLaunches();
  }

}

async function populateLaunches() {
  console.log('Downloading launch data...')
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
              name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  });

  if(response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;
  launchDocs.forEach(mapLaunch);
}

async function mapLaunch(launchDoc) {
  const payloads = launchDoc['payloads'];
  const customers = payloads.flatMap((payload) => payload['customers'])

  const launch = {
    flightNumber: launchDoc['flight_number'],
    mission: launchDoc['name'],
    rocket: launchDoc['rocket']['name'],
    launchDate: launchDoc['date_local'],
    upcoming: launchDoc['upcoming'],
    success: launchDoc['success'],
    customers
  }

  console.log(`${launch.flightNumber} ${launch.mission}`)

  await saveLaunch(launch);
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId
  });
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase.find({}, {
    '__v': 0,
    '_id': 0
  })
  .sort({ flightNumber: 1 })  //Con menos uno estaria ordenando por valor descendente
  .skip(skip)
  .limit(limit);;
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber');  // Al reves que lo normal - El menos hace que sea descendente

  if(!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate({  // A distinto de updateOne este mensaje no guarda en lo que le pasas para crear (no lo muta) lo que guarda directamente en mongo
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true    // insert + update - la idea es si no existe que lo crea, si existe que actualize noma
  })
}

async function scheduleNewLaunch(launch) {
  const planet = await getPlanet(launch.target);  //Esta funcion solo se usa para agregar lanzamientos a exoplanetas, por eso el chequeo

  if(!planet) {
    throw new Error('Not matching planet was found on the target');
  }

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
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById
}