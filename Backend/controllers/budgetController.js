const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// @desc    Create a new budget
// @route   POST /api/v1/budgets
// @access  Private
exports.createBudget = async (req, res) => {
    try {
        const { category, amount, startDate, endDate, isRecurring, recurrenceType } = req.body;

        // Basic validation
        if (!category || !amount || !startDate || !endDate) {
            return res.status(400).json({ message: 'Please enter all required fields.' });
        }

        const newBudget = new Budget({
            user: req.user.id,
            category,
            amount,
            startDate,
            endDate,
            isRecurring: isRecurring || false,
            recurrenceType: isRecurring ? recurrenceType : null
        });

        const savedBudget = await newBudget.save();
        res.status(201).json(savedBudget);
    } catch (error) {
        res.status(500).json({ message: 'Error creating budget', error: error.message });
    }
};

// @desc    Get all budgets for a user
// @route   GET /api/v1/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id }).sort({ startDate: -1 });
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching budgets', error: error.message });
    }
};

// @desc    Get a single budget by ID
// @route   GET /api/v1/budgets/:id
// @access  Private
exports.getBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching budget', error: error.message });
    }
};

// @desc    Update a budget
// @route   PUT /api/v1/budgets/:id
// @access  Private
exports.updateBudget = async (req, res) => {
    try {
        const { category, amount, startDate, endDate, isRecurring, recurrenceType } = req.body;

        let budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        budget.category = category || budget.category;
        budget.amount = amount || budget.amount;
        budget.startDate = startDate || budget.startDate;
        budget.endDate = endDate || budget.endDate;
        budget.isRecurring = typeof isRecurring === 'boolean' ? isRecurring : budget.isRecurring;
        budget.recurrenceType = isRecurring ? recurrenceType : null;

        const updatedBudget = await budget.save();
        res.status(200).json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: 'Error updating budget', error: error.message });
    }
};

// @desc    Delete a budget
// @route   DELETE /api/v1/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json({ message: 'Budget removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting budget', error: error.message });
    }
};

// @desc    Get budget vs actual spending report
// @route   GET /api/v1/budgets/report/actual-vs-budget
// @access  Private
exports.getBudgetVsActual = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const { startDate, endDate } = req.query; // Optional date range for the report itself

        const matchQuery = {
            user: userId,
        };

        // If specific start/end dates are provided for the overall report, filter budgets by them.
        // Note: Budget dates define the budget period, these query params filter which budgets to include in the report.
        if (startDate) {
            matchQuery.startDate = { ...matchQuery.startDate, $gte: new Date(startDate) };
        }
        if (endDate) {
            matchQuery.endDate = { ...matchQuery.endDate, $lte: new Date(endDate) };
        }

        const report = await Budget.aggregate([
            { $match: matchQuery },
            {
                $lookup: {
                    from: 'expenses', // The collection name for Expense model (usually pluralized and lowercase)
                    let: { budgetCategory: '$category', budgetStartDate: '$startDate', budgetEndDate: '$endDate', budgetUserId: '$user' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', '$budgetUserId'] },
                                        { $eq: ['$category', '$budgetCategory'] },
                                        { $gte: ['$date', '$budgetStartDate'] },
                                        { $lte: ['$date', '$budgetEndDate'] }
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalSpent: { $sum: '$amount' }
                            }
                        }
                    ],
                    as: 'actualSpending'
                }
            },
            {
                $addFields: {
                    actualSpent: { $ifNull: [{ $arrayElemAt: ['$actualSpending.totalSpent', 0] }, 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    category: 1,
                    budgetAmount: '$amount',
                    startDate: 1,
                    endDate: 1,
                    isRecurring: 1,
                    recurrenceType: 1,
                    actualSpent: 1,
                    remaining: { $subtract: ['$amount', '$actualSpent'] },
                    status: {
                        $cond: {
                            if: { $gt: ['$actualSpent', '$amount'] },
                            then: 'overspent',
                            else: 'within_budget'
                        }
                    }
                }
            },
            {
                $sort: { startDate: -1 }
            }
        ]);

        res.status(200).json(report);

    } catch (error) {
        console.error("Error fetching budget vs actual report:", error);
        res.status(500).json({ message: 'Error fetching budget vs actual report', error: error.message });
    }
};
