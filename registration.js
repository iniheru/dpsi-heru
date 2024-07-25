const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const {db} = require('./firebase');

const SECRET_KEY = 'your_secret_key';

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userRef = db.collection('users').doc();
  await userRef.set({
    email,
    password: hashedPassword,
    name
  });

  const token = jwt.sign({ userId: userRef.id, email }, SECRET_KEY);
  res.status(201).json({ token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userRef = db.collection('users').where('email', '==', email);
  const snapshot = await userRef.get();

  if (snapshot.empty) {
    return res.status(400).json({ message: 'User not found' });
  }

  const user = snapshot.docs[0].data();
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ userId: snapshot.docs[0].id, email }, SECRET_KEY);
  res.status(200).json({ token });
});

module.exports = router;
