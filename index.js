const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const catalogRoute = require('./app/routes/catalog');
app.use('/', catalogRoute);

const dashboardRoute = require('./app/routes/dashboard');
app.use('/admin', dashboardRoute);

const db = require("./app/models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log('Server Listening on Port : ', PORT);
});