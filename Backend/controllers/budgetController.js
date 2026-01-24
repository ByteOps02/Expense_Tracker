const Budget = require('../models/Budget');
const mongoose = require('mongoose');
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { validateObjectId } = require("../utils/queryValidator");

// @desc    Create a new budget
// @route   POST /api/v1/budgets
// @access  Private
exports.createBudget = asyncHandler(async (req, res, next) => {
    const { title, category, amount, startDate, endDate, isRecurring, recurrenceType } = req.body;

    const newBudget = await Budget.create({
        user: req.user.id,
        title,
        category,
        amount,
        startDate,
        endDate,
        isRecurring: isRecurring || false,
        recurrenceType: isRecurring ? recurrenceType : null
    });

    res.status(201).json({
        status: "success",
        data: {
            budget: newBudget
        }
    });
});

// @desc    Get all budgets for a user
// @route   GET /api/v1/budgets
// @access  Private
exports.getBudgets = asyncHandler(async (req, res, next) => {
    const budgets = await Budget.find({ user: req.user.id }).sort({ startDate: -1 });
    
    res.status(200).json({
        status: "success",
        results: budgets.length,
        data: {
            budgets
        }
    });
});

// @desc    Get a single budget by ID
// @route   GET /api/v1/budgets/:id
// @access  Private
exports.getBudget = asyncHandler(async (req, res, next) => {
    // Validate budget ID and user ID
    const budgetId = validateObjectId(req.params.id, 'Budget ID');
    const userId = validateObjectId(req.user.id, 'User ID');
    
    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
        return next(new AppError("No budget found with that ID for this user", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            budget
        }
    });
});

// @desc    Update a budget
// @route   PUT /api/v1/budgets/:id
// @access  Private
exports.updateBudget = asyncHandler(async (req, res, next) => {
    // Validate budget ID and user ID
    const budgetId = validateObjectId(req.params.id, 'Budget ID');
    const userId = validateObjectId(req.user.id, 'User ID');
    
    const budget = await Budget.findOneAndUpdate(
        { _id: budgetId, user: userId },
        req.body,
        { new: true, runValidators: true }
    );

    if (!budget) {
        return next(new AppError("No budget found with that ID for this user", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            budget
        }
    });
});

// @desc    Delete a budget
// @route   DELETE /api/v1/budgets/:id
// @access  Private
exports.deleteBudget = asyncHandler(async (req, res, next) => {
    // Validate budget ID and user ID
    const budgetId = validateObjectId(req.params.id, 'Budget ID');
    const userId = validateObjectId(req.user.id, 'User ID');
    
    const budget = await Budget.findOneAndDelete({ _id: budgetId, user: userId });

    if (!budget) {
        return next(new AppError("No budget found with that ID for this user", 404));
    }

    res.status(204).json({
        status: "success",
        data: null
    });
});

// @desc    Get budget vs actual spending report
// @route   GET /api/v1/budgets/report/actual-vs-budget
// @access  Private
exports.getBudgetVsActual = asyncHandler(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { startDate, endDate } = req.query;

    const matchQuery = { user: userId };

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
                from: 'expenses',
                let: { budgetCategory: '$category', budgetStartDate: '$startDate', budgetEndDate: '$endDate', budgetUserId: '$user' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$user', '$$budgetUserId'] },
                                    { $eq: ['$category', '$$budgetCategory'] },
                                    { $gte: ['$date', '$$budgetStartDate'] },
                                    { $lte: ['$date', '$$budgetEndDate'] }
                                ]
                            }
                        }
                    },
                    { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
                ],
                as: 'actualSpending'
            }
        },
        { $addFields: { actualSpent: { $ifNull: [{ $arrayElemAt: ['$actualSpending.totalSpent', 0] }, 0] } } },
        {
            $project: {
                _id: 1,
                title: 1,
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
        { $sort: { startDate: -1 } }
    ]);

    if (!report) {
        return res.status(200).json({
            status: "success",
            results: 0,
            data: {
                report: []
            }
        });
    }

    res.status(200).json({
        status: "success",
        results: report.length,
        data: {
            report
        }
    });
});

