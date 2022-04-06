const { 
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  let errorMessage = null;

  if(errorMessage = validateLaunch(launch)) {
    return res.status(400).json({
      error: errorMessage
    });
  }
  
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function validateLaunch(launch) {  //Cambiar si es esto solo
  if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return 'Missing required launch properties';
  }
  launch.launchDate = new Date(launch.launchDate);  // "Parseo" el string que me pasan del json a Date
  if(launch.launchDate.toString() === 'Invalid Date') {
    return 'Invalid launch date';
  }
}

function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  if(!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: 'Launch not found'
    });
  }

  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);   //cuando devolves asi no hace falta JSON.stringify()
}


module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
};