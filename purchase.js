const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const authenticateToken = require('./auth');
const {db} = require('./firebase');

router.use(authenticateToken);

router.post('/purchase', async (req, res) => {
  const { cartItems, shippingInfo, paymentMethod } = req.body;
  const orderRef = db.collection('orders').doc();

  try {
    await db.runTransaction(async (t) => {
      cartItems.forEach(async (item) => {
        const productRef = db.collection('products').doc(item.productId);
        const productDoc = await t.get(productRef);

        if (!productDoc.exists) {
          throw new Error(`Product ${item.productId} does not exist`);
        }

        const product = productDoc.data();
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        t.update(productRef, { stock: product.stock - item.quantity });
      });

      await t.set(orderRef, {
        userId: req.user.userId,
        cartItems,
        shippingInfo,
        paymentMethod,
        status: 'pending',
        createdAt: new Date()
      });
    });

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
