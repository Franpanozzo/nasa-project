const mongoose = require('mongoose');

require('dotenv').config();
                               
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {     //mongoose.connection nos da un event emmiter para cuando la conexion esta lista
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
})

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}