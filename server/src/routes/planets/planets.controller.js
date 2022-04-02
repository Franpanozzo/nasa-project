const { getAllPlanets } = require('../../models/planets.model');

function httpGetAllPlanets(req, res) {
  res.status(200).json(getAllPlanets()); 
} //El return es SOLO para asegurarnos que nuestra funcion termina de ejcutar y solos se setea una vez la respuesta (not necessary)

module.exports = {
  httpGetAllPlanets
}