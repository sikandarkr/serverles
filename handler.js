'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var compression = require('compression');
var jwt = require("jsonwebtoken");

require('dotenv').config({ path: './variables.env' });
require('./db').connectToDatabase();

app.use(compression()); //use compression
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000
  })
);
app.use(bodyParser.json({ limit: "50mb" ,strict: false }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit:50000 }));
app.use(cors());
app.set("secretKey", process.env.PUBLIC_KEY); // jwt secret token
const routes = require('./routes/routes.js')
app.use('/', routes);

module.exports = app;
