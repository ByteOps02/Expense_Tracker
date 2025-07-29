import React from 'react'

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div
      className={`flex gap-6 bg-gradient-to-br from-white via-gray-50 to-purple-50 p-6 rounded-2xl shadow-xl border border-gray-200/50 items-center justify-start relative overflow-hidden w-[340px] h-[110px] hover-lift transition-all duration-300 ease-in-out`}
      style={{ boxShadow: '0 6px 24px 0 rgba(80, 56, 200, 0.10)' }}
    >
      <div
        className={`w-14 h-14 flex items-center justify-center text-[30px] text-white ${color} rounded-full drop-shadow-xl shadow-lg`}
        style={{ minWidth: '56px', minHeight: '56px', boxShadow: '0 2px 8px 0 rgba(80, 56, 200, 0.14)' }}
      >
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <h6 className='text-base text-gray-500 mb-1 font-medium tracking-wide'>{label}</h6>
        <span className='text-[26px] font-bold text-gray-900 drop-shadow-sm'>{value}</span>
      </div>
      {/* Decorative blurred circle for effect */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-200 opacity-20 rounded-full blur-2xl pointer-events-none" />
    </div>
  )
}

export default InfoCard