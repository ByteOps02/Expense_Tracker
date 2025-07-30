import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6"

const Input = ({ value, onChange, placeholder, label, type, error, ...rest }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-4">
            <label className='text-[13px] text-slate-800'>{label}</label>
            <div className={`input-box ${error ? 'border-red-500' : ''}`} style={{ position: 'relative' }}>
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    className="w-full bg-transparent outline-none pr-16"
                    onChange={onChange}
                    placeholder={placeholder}
                    {...rest}
                />
                {type === 'password' && (
                    <>
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className="text-primary cursor-pointer"
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className="text-primary cursor-pointer"
                                onClick={toggleShowPassword}
                            />
                        )}
                    </>
                )}
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    )
}

export default Input