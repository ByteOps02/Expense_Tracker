const Budget = require('../models/Budget');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
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

    // 1. Fetch Budgets
    const budgets = await Budget.find(matchQuery).sort({ startDate: -1 }).lean();

    if (!budgets || budgets.length === 0) {
        return res.status(200).json({
            status: "success",
            results: 0,
            data: { report: [] }
        });
    }

    // 2. Determine date range for expenses to minimize fetch
    // We need expenses that could possibly fall into ANY of the fetched budgets
    const minDate = budgets.reduce((min, b) => new Date(b.startDate) < min ? new Date(b.startDate) : min, new Date(8640000000000000));
    const maxDate = budgets.reduce((max, b) => new Date(b.endDate) > max ? new Date(b.endDate) : max, new Date(-8640000000000000));


    console.log(`\n\n--- DEBUG RUN ${new Date().toISOString()} ---`);
    console.log(`User ID: ${userId}`);
    console.log(`Budgets Found: ${budgets.length}`);
    console.log(`Global Date Range: ${minDate.toISOString()} to ${maxDate.toISOString()}`);

    // 3. Fetch Expenses (only necessary fields)
    const expenses = await Expense.find(
        {
            user: userId,
            date: { $gte: minDate, $lte: maxDate }
        }
    ).select('amount category date').lean();


    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate Expense Distribution (Group by Category)
    const expenseDistributionMap = expenses.reduce((acc, curr) => {
        const cat = (curr.category || "Uncategorized").trim();
        acc[cat] = (acc[cat] || 0) + curr.amount;
        return acc;
    }, {});

    const expenseDistribution = Object.keys(expenseDistributionMap).map(key => ({
        category: key,
        amount: expenseDistributionMap[key]
    }));

    console.log(`Expenses Found (Count): ${expenses.length}`);
    if (expenses.length > 0) {
        console.log(`Sample Expense: ${JSON.stringify(expenses[0])}`);
    } else {
        console.log("No expenses found in date range. Checking wider range...");
        const allExpenses = await Expense.find({ user: userId }).limit(1).lean();
        console.log(`Any expense for user? ${allExpenses.length > 0 ? JSON.stringify(allExpenses[0]) : 'NONE'}`);
    }

    // 4. Merge in Memory (Map expenses to budgets)
    const report = budgets.map(budget => {
        const budgetCategory = (budget.category || "").trim().toLowerCase();
        // Check if category name implies a global/total budget
        const globalKeywords = ['total', 'all', 'budget', 'overall', 'monthly', 'year'];
        const isGlobalBudget = globalKeywords.some(keyword => budgetCategory.includes(keyword));
        

        console.log(`Processing Budget: "${budget.category}" (isGlobal: ${isGlobalBudget})`);
        
        // Sum expenses that match this budget's category and date range
        const actualSpent = expenses.reduce((sum, expense) => {
            const expenseCategory = (expense.category || "").trim().toLowerCase();
            const isCategoryMatch = isGlobalBudget || expenseCategory === budgetCategory;
            
            const expenseDate = new Date(expense.date);
            const budgetStart = new Date(budget.startDate);
            const budgetEnd = new Date(budget.endDate);
            // Fix: Set budgetEnd to end of day
            budgetEnd.setHours(23, 59, 59, 999);

            const isDateMatch = expenseDate >= budgetStart && expenseDate <= budgetEnd;

            if (isCategoryMatch && isDateMatch) {
                 return sum + expense.amount;
            }
            return sum;
        }, 0);
        
        
        console.log(`Total Spent: ${actualSpent}`);
        
        const status = actualSpent > budget.amount ? 'overspent' : 'within_budget';

        return {
            ...budget,
            budgetAmount: budget.amount, // Maintain compatibility with frontend
            actualSpent,
            remaining: budget.amount - actualSpent,
            status
        };
    });



    res.status(200).json({
        status: "success",
        results: report.length,
        data: {
            report,
            totalExpenses, // Send the grand total
            expenseDistribution // Send breakdown of all expenses
        }
    });
});

