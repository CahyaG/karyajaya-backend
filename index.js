const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require('path');
const cors = require('cors')

global.publicUrl = path.join(__dirname, 'public/');

dotenv.config();
const app = express();
app.use(cors())

const db = require("./app/models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err);
  });

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(
  fileUpload({
    limits: {
      fileSize: 10000000, // Around 10MB
    },
    abortOnLimit: true,
  })
);

const route = require('./app/routes/route');
app.use('/', route);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server Listening on Port : ', PORT);
});