import React from 'react'

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className={`flex gap-6 bg-white p-6 rounded-2xl shadow-gray-100 border-gray-200/50 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg items-center`}> 
      <div className={`w-16 h-16 flex items-center justify-center text-[32px] text-white ${color} rounded-full drop-shadow-xl transition-all duration-300`}> 
        {icon}
      </div>
      <div>
        <h6 className='text-sm text-gray-500 mb-1'>{label}</h6>
        <span className='text-[28px] font-semibold'>${value}</span>
      </div>
    </div>
  )
}

export default InfoCard