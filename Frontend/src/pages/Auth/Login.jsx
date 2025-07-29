import React, { useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email) || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      // Assuming response.data.token contains the JWT
      localStorage.setItem('token', response.data.token);
      updateUser(response.data.user); // Update user context
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ErrorBoundary>
      <AuthLayout>
        <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
          <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
          <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please Enter Your Details To Login</p>
          <form onSubmit={handleLogin}>
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              label="Email Address"
              placeholder="Ram123@example.com"
              type="text"
              autoComplete="username"
              disabled={isLoading}
            />
            <Input
              value={password}
              onChange={e => setPassword(e.target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
            />
            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
            <button 
              type="submit" 
              className='btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" variant="white" />
                  Logging in...
                </div>
              ) : (
                'LOGIN'
              )}
            </button>
            <p className='text-[13px] text-slate-800 mt-3'>
              Don't have an account?{' '}
              <Link
                className="font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent underline hover:from-fuchsia-500 hover:to-purple-500 transition-colors duration-200 text-[15px]"
                to="/signup"
              >
                SignUp
              </Link>
            </p>
          </form>
        </div>
      </AuthLayout>
    </ErrorBoundary>
  )
}

export default Login 