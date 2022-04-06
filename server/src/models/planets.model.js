const fs = require('fs');
const path = require('path')
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

function isHabitablePlanet(planet) {
  const stellarFlux = planet['koi_insol']
  return planet['koi_disposition'] === 'CONFIRMED'
  && stellarFlux > 0.36 && stellarFlux < 1.11
  && planet['koi_prad'] < 1.6;
}

function loadPlanetsData () {
  return new Promise((resolve, rejects) => {
      fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
    .pipe(parse({
      comment: '#', 
      columns: true  // Esto devuelve cada fila en nuestro csv como un objeto javascript
    }))
    .on('data', async (data) => {
      if(isHabitablePlanet(data)) {
        savePlanet(data);
      };
    })
    .on('error', err => {
      console.log(err);
      rejects(err);
    })
    .on('end', async () => {
      const countPlanetsFound = await getAllPlanets();
      console.log(`${countPlanetsFound.length} habitable planets found`);
      resolve();   // No devuelvo nada porque se carga en habitablePlanets, la promesa solamente es para que se espere a que este todo cargado
    });
  })
}

async function getAllPlanets() {
  return await planets.find({}, {   //El objeto dentro con los campos para filtrar - segundo parametro para decir que campos muestro o saco
    '__v': 0,
    '_id': 0   // 0 no muestra - 1 lo muestra
  }); 
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name  //Con este busca cual queres filtrar
    }, {
      keplerName: planet.kepler_name  //Con este lo que me metes si lo encontras
    }, {
      upsert: true
    });
  } catch(err) {
    console.error(`Could not save planet: ${err}`)
  }
}

async function getPlanet(planetName) {
  return await planets.findOne({
    keplerName: planetName
  })
}


  module.exports = {
    loadPlanetsData,
    getAllPlanets,
    getPlanet
  }