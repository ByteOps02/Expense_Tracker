import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';


const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('All fields are required.');
      return;
    }
    setError(null);
    try {
      let profileImageUrl = "";
      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        // updateUser(user); // Uncomment if updateUser is needed
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black '>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us by entering your details below.
        </p>
        {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="Ram"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            placeholder="Ram123@example.com"
            type="email"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
            autoComplete="new-password"
          />
          <button type="submit" className="btn-primary">Sign Up</button>
          <p className='text-[13px] text-slate-800 mt-3 text-left'>
            Already have an account?{' '}
            <Link
              className="font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent underline hover:from-fuchsia-500 hover:to-purple-500 transition-colors duration-200 text-[15px]"
              to="/login"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp