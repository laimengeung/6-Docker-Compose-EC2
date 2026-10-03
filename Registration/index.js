require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./db/dbconnect.js');
const PersonModel = require('./models/person_schema.js');

function uniqueid(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

//REG API
app.post('/reg', async (req, res) => {
  console.log("REG API EXECUTED");
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const pobj = new PersonModel({
      id: uniqueid(1000, 9999),
      name: req.body.firstname,
      emailid: req.body.email,
      pass: hashedPassword,
      mobile: req.body.mobile,
      role: req.body.role
    });

    const inserteddocument = await pobj.save();
    res.status(200).send('DOCUMENT INSERED IN MONGODB DATABASE');
  
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error in Employee Save ' })
  }  
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Registration Microservice Started at Port No: ${PORT}`)
});
