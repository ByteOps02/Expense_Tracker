const express = require('express');
const { Protect } = require('../middleware/authMiddleware');
const {
    createBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget,
    getBudgetVsActual
} = require('../controllers/budgetController');

const router = express.Router();

router.route('/')
    .post(Protect, createBudget)
    .get(Protect, getBudgets);

// New route for budget vs actual report
router.get('/report/actual-vs-budget', Protect, getBudgetVsActual);

router.route('/:id')
    .get(Protect, getBudget)
    .put(Protect, updateBudget)
    .delete(Protect, deleteBudget);

module.exports = router;
