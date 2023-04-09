const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const catalogRoute = require('./src/routes/routes-catalog');
app.use('/', catalogRoute);

const dashboardRoute = require('./src/routes/routes-dashboard');
app.use('/admin', dashboardRoute);


app.listen(8080, ()=>{
    console.log('Server Listening on Port : 8080');
});