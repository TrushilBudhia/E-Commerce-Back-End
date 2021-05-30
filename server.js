require('dotenv').config();
const express = require('express');
const routes = require('./routes');
// Importing sequelize connection
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
async function init () {
  await sequelize.sync({ force: false })
  app.listen(PORT, () => console.log('Now listening on port', PORT))
}

init();