const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const userRoutes = require('./app/controllers/authController');
const projectRoutes = require('./app/controllers/principalController');
const sequelize = require('./database/database');

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/principal', projectRoutes);
app.use('/auth', userRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
