import { useEffect, useState, FormEvent } from 'react';
import imagehome2 from '../assets/imagehome2.jpg';
import 'url-polyfill';
import { useNavigate } from 'react-router-dom';
import { FormDataState } from '../types/types';

const SignUpPage = () => {
  const [formData, setFormData] = useState<FormDataState>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  const [error, setError] = useState<string>('');
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'profileImage' ? (files ? files[0] : null) : value,
    }));
  };

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === '');
  }, [formData.password, formData.confirmPassword]);

  const validateForm = (): boolean => {
    if (!formData.firstname.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastname.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }
    if (!formData.profileImage) {
      setError('Profile image is required');
      return false;
    }
    if (!passwordMatch) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const signupForm = new FormData();
      signupForm.append('firstname', formData.firstname.trim());
      signupForm.append('lastname', formData.lastname.trim());
      signupForm.append('email', formData.email.trim().toLowerCase());
      signupForm.append('password', formData.password);
      signupForm.append('confirmPassword', formData.confirmPassword);
      if (formData.profileImage) {
        signupForm.append('profileImage', formData.profileImage);
      }

      // Debugging: Log the form data
      for (const pair of signupForm.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        body: signupForm,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'SignUp failed');
      }

      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        profileImage: null,
      });

      navigate('/login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      console.error('Failed to sign up:', errorMessage);
    }
  };

  return (
    <div className="w-screen h-screen flex">
      {/* Left Section */}
      <div className="w-3/4 relative">
        <img src={imagehome2} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Center Form */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-white p-3 rounded-xl shadow-lg w-3/5 h-[700px] flex">
          {/* Left Part of the form (Transparent) */}
          <div className="w-1/2 relative bg-gray-100 overflow-hidden">
            <img
              src={imagehome2}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover transform scale-[140%] hover:scale-130 transition-transform translate-x-[-60px] translate-y-[0px]"
            />
            <div className="absolute inset-0 bg-white opacity-50 mix-blend-multiply z-10"></div>
          </div>

          {/* Right Part of the form (Form Content) */}
          <div className="w-1/2 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">SignUp Page</h1>
            <p className="text-gray-600 mb-6 text-center">
              Find your perfect home, where comfort meets convenience. Sign up to explore endless possibilities
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
              <input
                onChange={handleChange}
                value={formData.firstname}
                placeholder="First Name"
                name="firstname"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={handleChange}
                value={formData.lastname}
                placeholder="Last Name"
                name="lastname"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={handleChange}
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email address"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={handleChange}
                type="password"
                name="password"
                value={formData.password}
                placeholder="Set password"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={handleChange}
                value={formData.confirmPassword}
                placeholder="Confirm Password"
                name="confirmPassword"
                type="password"
                className="w-full px-4 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {!passwordMatch && <p style={{ color: 'red' }}>Passwords do not match!</p>}
              <input
                onChange={handleChange}
                id="profile-image"
                name="profileImage"
                accept="image/*"
                type="file"
                className="hidden"
              />
              <label htmlFor="profile-image" className="flex items-center justify-center cursor-pointer text-center mt-4 bg-purple-300 p-2 rounded-md hover:bg-purple-400">
                <img src="/assets/addImage.png" alt="" className="mr-2 w-6" />
                <p className="text-gray-700">Upload Your Photo</p>
              </label>
              {formData.profileImage && (
                <img
                  src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : ''}
                  style={{ maxWidth: '80px', display: 'flex', alignItems: 'center', margin: '8px auto -5px' }}
                  alt=""
                />
              )}
              <button
                disabled={!passwordMatch || Boolean(error)}
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 mt-6"
              >
                Sign up free
              </button>
            </form>
            <p className="text-sm text-gray-400 mt-4 text-center">
              By signing up I agree to the{" "}
              <a href="#" className="text-purple-600 underline">
                terms & conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 underline">
                privacy policy
              </a>
            </p>
            <p className="mt-6 text-gray-500 text-center">
              Already a user?{" "}
              <a href="/login" className="text-purple-600 underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div className="w-2/5 relative bg-[#62371B]">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Right content goes here if needed */}
        </div>
      </div>
    </div>
    
  );
};

export default SignUpPage;
