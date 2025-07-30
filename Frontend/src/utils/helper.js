export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionalPart !== undefined
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  // Group expenses by category and sum the amounts
  const groupedData = data.reduce((acc, item) => {
    const category = item?.category || "Other";
    if (acc[category]) {
      acc[category] += item?.amount || 0;
    } else {
      acc[category] = item?.amount || 0;
    }
    return acc;
  }, {});

  // Convert to array format expected by the chart
  const chartData = Object.entries(groupedData).map(([category, amount]) => ({
    category: category,
    amount: amount,
    month: category, // Using category as month for the X-axis
  }));

  return chartData;
};

export const prepareExpenseTimeSeriesData = (data = []) => {
  // Ensure data is an array and handle null/undefined cases
  if (!Array.isArray(data)) {
    return [];
  }

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: new Date(item?.date).toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  // Ensure data is an array and handle null/undefined cases
  if (!Array.isArray(data)) {
    return [];
  }

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: new Date(item?.date).toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  // Ensure data is an array and handle null/undefined cases
  if (!Array.isArray(data)) {
    return [];
  }

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: new Date(item?.date).toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};