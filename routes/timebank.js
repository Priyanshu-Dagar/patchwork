const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TimeTransaction = require('../models/TimeTransaction');
const { requireLogin } = require('../middleware/auth');

// Transfer Credits (Teaching/Help)
router.post('/transfer', requireLogin, async (req, res) => {
  const { toUsername, amount, reason } = req.body;
  try {
    const fromUser = await User.findById(req.session.user.id);
    const toUser = await User.findOne({ username: toUsername });

    if (!toUser) return res.status(404).send('Recipient not found');
    if (fromUser.timeCredits < amount) return res.status(400).send('Insufficient credits');
    if (fromUser._id.equals(toUser._id)) return res.status(400).send('Cannot transfer to yourself');

    fromUser.timeCredits -= Number(amount);
    toUser.timeCredits += Number(amount);

    await fromUser.save();
    await toUser.save();

    const transaction = new TimeTransaction({
      fromUser: fromUser._id,
      toUser: toUser._id,
      amount: Number(amount),
      reason: reason || 'teaching'
    });
    await transaction.save();

    res.redirect('/dashboard?success=Transfer complete');
  } catch (err) {
    res.status(500).send('Transfer failed');
  }
});

// View Transaction History
router.get('/history', requireLogin, async (req, res) => {
  try {
    const transactions = await TimeTransaction.find({
      $or: [{ fromUser: req.session.user.id }, { toUser: req.session.user.id }]
    }).populate('fromUser toUser projectId').sort('-timestamp');
    res.render('timebank_history', { title: 'Time Bank History', transactions });
  } catch (err) {
    res.status(500).send('Error loading history');
  }
});

module.exports = router;
