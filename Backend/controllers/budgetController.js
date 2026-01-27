const Budget = require('../models/Budget');
const Income = require('../models/Income');
const mongoose = require('mongoose');
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { validateObjectId } = require("../utils/queryValidator");

exports.createBudget = asyncHandler(async (req, res, next) => {
    const { category, amount, startDate, endDate, isRecurring, recurrenceType } = req.body;

    // Calculate total income
    const incomeAggregation = await Income.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalIncome = incomeAggregation.length > 0 ? incomeAggregation[0].total : 0;

    // Calculate total existing budgets
    const budgetAggregation = await Budget.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalBudgets = budgetAggregation.length > 0 ? budgetAggregation[0].total : 0;

    if (totalBudgets + amount > totalIncome) {
        return next(new AppError(`Total budget (${totalBudgets + amount}) cannot exceed total income (${totalIncome})`, 400));
    }

    const newBudget = await Budget.create({
        user: req.user.id,
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

exports.getBudget = asyncHandler(async (req, res, next) => {
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

exports.updateBudget = asyncHandler(async (req, res, next) => {
    const budgetId = validateObjectId(req.params.id, 'Budget ID');
    const userId = validateObjectId(req.user.id, 'User ID');
    
    const { amount } = req.body;

    if (amount !== undefined) {
        // Calculate total income
        const incomeAggregation = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalIncome = incomeAggregation.length > 0 ? incomeAggregation[0].total : 0;

        // Calculate total other budgets (excluding this one)
        const budgetAggregation = await Budget.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id), _id: { $ne: new mongoose.Types.ObjectId(budgetId) } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalOtherBudgets = budgetAggregation.length > 0 ? budgetAggregation[0].total : 0;

        if (totalOtherBudgets + amount > totalIncome) {
            return next(new AppError(`Total budget (${totalOtherBudgets + amount}) cannot exceed total income (${totalIncome})`, 400));
        }
    }

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

exports.deleteBudget = asyncHandler(async (req, res, next) => {
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
                                    { $eq: [{ $toLower: '$category' }, { $toLower: '$$budgetCategory' }] },
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

