const fs = require('fs');
const path = require('path')
const { parse } = require('csv-parse');

const habitablePlanets = [];

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
      columns: true //This will return each row in our csv as a javascript object
    }))
    .on('data', data => {
      if(isHabitablePlanet(data)) habitablePlanets.push(data);
    })
    .on('error', err => {
      console.log(err);
      rejects(err);
    })
    .on('end', () => {
      console.log(`${habitablePlanets.length} habitable planets found`);
      resolve();   // No devuelvo nada porque se carga en habitablePlanets, la promesa solamente es para que se espere a que este todo cargado
    });
  })
}


  module.exports = {
    loadPlanetsData,
    planets: habitablePlanets
  }