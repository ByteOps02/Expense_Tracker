import React, { useEffect, useState } from 'react'
import { prepareExpenseBarChartData } from '../../utils/helper';

const Last30DaysTransactions = ({ data }) => {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseBarChartData(data);
        setChartData(result);
    }, [data]);
    return (
        <div className='card col-span-1 hover-lift transition-all duration-300 ease-in-out'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Last 30 Days Transactions</h5>
            </div>
            {/* Placeholder for chart or transaction list */}
            <pre>{JSON.stringify(chartData, null, 2)}</pre>
        </div>
    )
}

export default Last30DaysTransactions