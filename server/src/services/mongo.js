const mongoose = require('mongoose');

// Tiene que matchear los datos particulares de mi base de datos
//                              nombreDB : contra                                     
const MONGO_URL = 'mongodb+srv://nasa-api:WeC0eRIgBwW15nXb@nasacluster.mnuhm.mongodb.net/nasa?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {     //mongoose.connection nos da un event emmiter para cuando la conexion esta lista
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
})

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

module.exports = {
  mongoConnect
}