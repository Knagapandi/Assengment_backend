const express = require('express');
const Purchase = require('../models/Purchase');
const Plan = require('../models/Plan');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/buy', async (req, res) => {
  const { customerId, planId } = req.body;

  try {
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ msg: 'Plan not found' });

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

    const purchase = new Purchase({
      customerId,
      planId,
      expiryDate,
    });

    await purchase.save();
    res.json(purchase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
