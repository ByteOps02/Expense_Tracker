// check email format
export let validateEmail = (email) => {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// get name initials
export let getInitials = (name) => {
  if (!name) return "";

  let words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

// add commas to numbers
export let addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  let parts = num.toString().split(".");
  let integerPart = parts[0];
  let fractionalPart = parts[1];
  
  let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  if (fractionalPart !== undefined) {
      return `${formattedInteger}.${fractionalPart}`;
  }
  return formattedInteger;
};

export let prepareExpenseLineChartData = (data = []) => {
  if (!Array.isArray(data)) {
    return [];
  }

  let sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  let chartData = [];
  for (let i = 0; i < sortedData.length; i++) {
      let item = sortedData[i];
      if (item) {
          chartData.push({
              month: new Date(item.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
              }),
              amount: item.amount,
              category: item.category,
          });
      }
  }

  return chartData;
};

export let prepareIncomeBarChartData = (data = []) => {
  if (!Array.isArray(data)) {
    return [];
  }

  let sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  let chartData = [];
  for (let i = 0; i < sortedData.length; i++) {
      let item = sortedData[i];
      chartData.push({
          month: new Date(item?.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
          }),
          amount: item?.amount,
          source: item?.source,
      });
  }

  return chartData;
};

export let prepareCategoryData = (data = [], key = "category") => {
  if (!Array.isArray(data)) return [];

  let grouped = {};
  for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let label = item[key] || "Other";
      if (!grouped[label]) {
          grouped[label] = 0;
      }
      grouped[label] += (item.amount || 0);
  }

  let result = [];
  for (let label in grouped) {
      result.push({ name: label, amount: grouped[label] });
  }
  
  return result;
};

export let prepareTitleAndCategoryData = (data = []) => {
  if (!Array.isArray(data)) return [];

  let grouped = {};
  for (let i = 0; i < data.length; i++) {
      let item = data[i];
      if (!item) continue;
      let label = `${item.title || 'Unknown'} (${item.category || item.source || "N/A"})`;
      if (!grouped[label]) {
          grouped[label] = 0;
      }
      grouped[label] += (item.amount || 0);
  }

  let result = [];
  for (let label in grouped) {
      result.push({ name: label, amount: grouped[label] });
  }

  return result;
};

export const CHART_COLORS = [
  "#875CF5",
  "#FA2C37", 
  "#FF6900", 
  "#4ADE80", 
  "#3B82F6", 
  "#ec4899", 
  "#06b6d4", 
  "#f59e0b", 
  "#6366f1", 
  "#14b8a6", 
  "#a855f7", 
  "#0ea5e9", 
];
