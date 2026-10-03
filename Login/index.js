require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./db/dbconnect.js');
const PersonModel = require('./models/person_schema.js');

// LOGIN API
app.post('/login', async (req, res) => {
  console.log("LOGIN API EXECUTED");
  try {
    const founduser = await PersonModel.findOne({ emailid: req.body.email });

    if (!founduser) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }
  
    const ismatch = await bcrypt.compare(req.body.password, founduser.pass);

    if (!ismatch) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: founduser.id,
        emailid: founduser.emailid,
        role: founduser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).send({
      message: 'LOGIN SUCCESSFUL',
      token: token,
      user: {
        id: founduser.id,
        name: founduser.id,
        emailid: founduser.emailid,
        role: founduser.role
      }
    });

  } catch (err) {
    res.status(500).send({ message: err.message || 'Error in Login' })
  }
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Login Microservice Started at Port No: ${PORT}`);
});