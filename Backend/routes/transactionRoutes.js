const express = require('express');
const { Protect } = require('../middleware/authMiddleware');
const { getAllTransactions } = require('../controllers/transactionController');

const router = express.Router();

router.route('/')
    .get(Protect, getAllTransactions);

module.exports = router;
