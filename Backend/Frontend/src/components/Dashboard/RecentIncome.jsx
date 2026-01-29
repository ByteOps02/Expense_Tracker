import React from "react";
import TransactionsTable from "../Transactions/TransactionsTable";
import DashboardWidget from "./DashboardWidget";

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
    <DashboardWidget title="Income" onSeeMore={onSeeMore}>
        <TransactionsTable 
            data={transactions?.slice(0, 5)} 
            showActions={false}
            type="income"
        />
    </DashboardWidget>
  );
};

export default RecentIncome;
