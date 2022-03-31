const { planets } = require('../../models/planets.model');

function getAllPlanets(req, res) {
  res.status(200).json(planets); 
} //El return es SOLO para asegurarnos que nuestra funcion termina de ejcutar y solos se setea una vez la respuesta (not necessary)

module.exports = {
  getAllPlanets
}