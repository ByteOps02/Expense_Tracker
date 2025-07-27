import React, { useState } from 'react';
import { IndianRupee, Calendar, Briefcase, Check, Sparkles, TrendingUp } from "lucide-react";

const AddIncomeForm = ({ onAddIncome }) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "💰",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onAddIncome) onAddIncome(income);
        setIncome({ source: "", amount: "", date: "", icon: "💰" });
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 2500);
    };

    const isFormValid = income.source && income.amount && income.date;

    const emojiOptions = ["💰", "💵", "💳", "🏦", "💼", "📈", "🎯", "⭐", "🔥", "✨"];

    return (
        <div className="bg-white/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-purple-500/10 p-6 overflow-hidden">

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(147, 51, 234, 0.3) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                }} />
            </div>

            {/* Header Section */}
            <div className="relative z-10 mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 transform hover:scale-105 transition-all duration-300">
                            <IndianRupee className="w-7 h-7 text-white drop-shadow-lg" />
                        </div>
                        {/* Floating sparkle */}
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                            <Sparkles className="w-2.5 h-2.5 text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-violet-800 bg-clip-text text-transparent">
                            Add Income
                        </h2>
                        <p className="text-gray-600 mt-0.5 font-medium text-sm">
                            <span className="text-violet-600 font-semibold">Boost your finances</span> and reach your goals 🎯
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="relative z-10 mb-5">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-medium text-gray-600">Form Progress</span>
                </div>
                <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${((income.source ? 1 : 0) + (income.amount ? 1 : 0) + (income.date ? 1 : 0)) / 3 * 100}%`
                        }}
                    />
                </div>
            </div>

            {/* Icon Picker */}
            <div className="relative z-10 mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Choose Your Icon
                </label>
                <div className="bg-gradient-to-br from-gray-50/70 via-gray-100 to-gray-200 rounded-xl border border-violet-200/60 px-4 py-2">
                    <div className="flex flex-wrap gap-1.5">
                        {emojiOptions.map((emoji, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleChange("icon", emoji)}
                                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all duration-200 hover:scale-110 ${income.icon === emoji
                                        ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-200'
                                        : 'border-gray-200 bg-white/70 hover:border-violet-300'
                                    }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5 relative z-10">

                {/* Income Source */}
                <div className="relative">
                    <label className={`absolute -top-2 left-3 px-2 text-sm font-medium transition-all duration-200 z-10 ${focusedField === 'source' || income.source ? 'text-violet-600 bg-white rounded-md' : 'text-gray-500 bg-transparent'
                        }`}>
                        <Briefcase className="inline w-4 h-4 mr-1" />
                        Income Source
                    </label>
                    <input
                        type="text"
                        value={income.source}
                        onChange={(e) => handleChange("source", e.target.value)}
                        onFocus={() => setFocusedField('source')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="e.g. Freelance, Salary, Business"
                        className={`w-full px-4 py-3 bg-white/70 border-2 rounded-xl transition-all duration-200 outline-none ${focusedField === 'source' || income.source
                                ? 'border-violet-400 shadow-lg shadow-violet-100'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    />
                </div>

                {/* Amount */}
                <div className="relative">
                    <label className={`absolute -top-2 left-3 px-2 text-sm font-medium transition-all duration-200 z-10 ${focusedField === 'amount' || income.amount ? 'text-green-600 bg-white rounded-md' : 'text-gray-500 bg-transparent'
                        }`}>
                        <IndianRupee className="inline w-4 h-4 mr-1" />
                        Amount
                    </label>
                    <input
                        type="number"
                        value={income.amount}
                        onChange={(e) => handleChange("amount", e.target.value)}
                        onFocus={() => setFocusedField('amount')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="0.00"
                        className={`w-full px-4 py-3 pr-12 bg-white/70 border-2 rounded-xl transition-all duration-200 outline-none ${focusedField === 'amount' || income.amount
                                ? 'border-green-400 shadow-lg shadow-green-100'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 font-bold text-lg">₹</div>
                </div>

                {/* Date */}
                <div className="relative">
                    <label className={`absolute -top-2 left-3 px-2 text-sm font-medium transition-all duration-200 z-10 ${focusedField === 'date' || income.date ? 'text-blue-600 bg-white rounded-md' : 'text-gray-500 bg-transparent'
                        }`}>
                        <Calendar className="inline w-4 h-4 mr-1" />
                        Date
                    </label>
                    <input
                        type="date"
                        value={income.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        onFocus={() => setFocusedField('date')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 bg-white/70 border-2 rounded-xl transition-all duration-200 outline-none ${focusedField === 'date' || income.date
                                ? 'border-blue-400 shadow-lg shadow-blue-100'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!isFormValid}
                    onClick={handleSubmit}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 ${isFormValid
                            ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 hover:-translate-y-1'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isSubmitted ? (
                        <>
                            <Check className="w-5 h-5 animate-bounce" />
                            Income Added Successfully!
                        </>
                    ) : (
                        <>
                            <span className="text-xl">{income.icon}</span>
                            Add Income
                        </>
                    )}
                </button>
            </div>

            {/* Success Message */}
            {isSubmitted && (
                <div className="absolute inset-x-4 bottom-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-lg z-20">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-green-800">Great job!</p>
                        <p className="text-sm text-green-600">Your income has been recorded successfully</p>
                    </div>
                </div>
            )}

            {/* Ready to Submit Indicator */}
            {!isSubmitted && isFormValid && (
                <div className="absolute inset-x-4 bottom-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3 shadow-lg animate-pulse z-20">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <IndianRupee className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-blue-700 font-medium text-sm">Ready to add your income!</span>
                </div>
            )}
        </div>
    );
};

export default AddIncomeForm;