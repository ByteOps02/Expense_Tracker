import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import moment from 'moment'
import TransactionInfoCard from '../Cards/TransactionInfoCard';

const RecentTransactions = ({ transactions, onSeeMore }) => {
    return (
        <div className='card'>
            <div className="flex items-center justify-between mb-2">
                <h5 className="text-lg font-semibold text-gray-900">Recent Transactions</h5>
                <button className='btn-primary w-auto px-4 py-2 text-sm flex items-center gap-1 hover-lift' onClick={onSeeMore}>
                    See All <LuArrowRight className="text-base" />
                </button>
            </div>
            <div className='mt-4'>
                {transactions?.length === 0 && (
                  <div className="text-gray-400 text-center py-6">No recent transactions.</div>
                )}
                {transactions?.slice(0,5)?.map((item) => (
                    <TransactionInfoCard
                        key={item._id}
                        title={item.type === 'expense' ? item.category : item.source}
                        icon={item.icon}
                        date={moment(item.date).format("DD MMM YYYY")}
                        amount={item.amount}
                        type={item.type}
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    )
}

export default RecentTransactions 