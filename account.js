const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const authenticateToken = require('./auth');
const {db} = require('./firebase');

router.use(authenticateToken);

router.get('/account', async (req, res) => {
  const userRef = db.collection('users').doc(req.user.userId);
  const doc = await userRef.get();

  if (!doc.exists) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(doc.data());
});

router.put('/account', async (req, res) => {
  const { name, address, email } = req.body;
  const userRef = db.collection('users').doc(req.user.userId);

  await userRef.update({ name, address, email });
  res.status(200).json({ message: 'Account updated successfully' });
});

module.exports = router;
