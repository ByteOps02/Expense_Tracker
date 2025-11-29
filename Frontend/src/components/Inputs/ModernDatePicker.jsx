import React, { useState, useRef, useEffect } from "react";
import { LuCalendar, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const ModernDatePicker = ({ value, onChange, error, colorTheme = "purple" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);

  const selectedDate = value ? new Date(value) : null;

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colorClasses = {
    purple: {
      focus: "focus:ring-purple-100 focus:border-purple-500",
      icon: "group-focus-within:text-purple-600",
      selected: "bg-purple-600 text-white hover:bg-purple-700",
      today: "border-2 border-purple-600",
      hover: "hover:bg-purple-50",
    },
    green: {
      focus: "focus:ring-green-100 focus:border-green-500",
      icon: "group-focus-within:text-green-600",
      selected: "bg-green-600 text-white hover:bg-green-700",
      today: "border-2 border-green-600",
      hover: "hover:bg-green-50",
    },
    red: {
      focus: "focus:ring-red-100 focus:border-red-500",
      icon: "group-focus-within:text-red-600",
      selected: "bg-red-600 text-white hover:bg-red-700",
      today: "border-2 border-red-600",
      hover: "hover:bg-red-50",
    },
  };

  const colors = colorClasses[colorTheme] || colorClasses.purple;

  const formatDisplayDate = (date) => {
    if (!date) return "Select date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleDateSelect = (date) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      onChange({ target: { value: formattedDate } });
      setIsOpen(false);
    }
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    return (
      date &&
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="space-y-2" ref={datePickerRef}>
      <label className="block text-sm font-semibold text-gray-700">
        Date <span className={`text-${colorTheme}-500`}>*</span>
      </label>
      <div className="relative">
        <div className="relative group">
          <LuCalendar
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${colors.icon}`}
          />
          <input
            type="text"
            readOnly
            value={formatDisplayDate(value)}
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900 cursor-pointer ${
              error
                ? "border-red-300 focus:ring-red-100 focus:border-red-500"
                : `border-gray-200 ${colors.focus}`
            }`}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 flex items-center gap-1 mt-1"
          >
            {error}
          </motion.p>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 w-full min-w-[320px]"
            >
              {/* Month/Year Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LuChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="font-semibold text-gray-900">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  type="button"
                  onClick={() => handleMonthChange(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LuChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    disabled={!date}
                    onClick={() => handleDateSelect(date)}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                      ${
                        !date
                          ? "invisible"
                          : isSelected(date)
                            ? colors.selected
                            : isToday(date)
                              ? `${colors.today} text-gray-900 ${colors.hover}`
                              : `text-gray-700 ${colors.hover}`
                      }
                    `}
                  >
                    {date?.getDate()}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDateSelect(new Date())}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernDatePicker;