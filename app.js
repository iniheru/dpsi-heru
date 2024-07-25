const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {db} = require('./firebase');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';
const PORT = process.env.PORT || 3000;

const registrationRouter = require('./registration');
const accountRouter = require('./account');
const purchaseRouter = require('./purchase');

app.use('/auth', registrationRouter);
app.use('/user', accountRouter);
app.use('/shop', purchaseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
