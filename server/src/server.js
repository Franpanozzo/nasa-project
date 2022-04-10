const http = require('http');

require('dotenv').config();  //Populates el objeto javascript en proccess.env con los valores en el .env (antes de las importaciones pa q este todo cargado)

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { mongoConnect } = require('./services/mongo');
const { loadLaunchesData } = require('./models/launches.model')

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  });
}

startServer();
