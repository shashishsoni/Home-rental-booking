import { useEffect, useState } from 'react';
import imagehome2 from '../assets/imagehome2.jpg';
import 'url-polyfill';
import { useNavigate } from 'react-router-dom';
import { FormDataState } from '../types/types';

const SignUpPage = () => {
  const [formData, setFormData] = useState<FormDataState>({
    firstname: '',
    lastname: '',
    Email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  const [error, setError] = useState<string>('');
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    if (!formData.Email.trim()) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstname", formData.firstname.trim());
      formDataToSend.append("lastname", formData.lastname.trim());
      formDataToSend.append("Email", formData.Email.trim().toLowerCase());
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.confirmPassword);
      
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

      if (response.status === 201) {
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Failed to sign up:", error);
      setError(error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:block lg:w-3/4 relative">
        <img src={imagehome2} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Center Form */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-white p-3 rounded-xl shadow-lg w-[95%] md:w-4/5 lg:w-3/5 h-[80%] max-h-screen flex flex-col lg:flex-row">
          {/* Left Part of the form (Transparent) */}
          <div className="hidden lg:block lg:w-1/2 relative bg-gray-100 overflow-hidden">
            <img
              src={imagehome2}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover transform scale-[130%] hover:scale-130 transition-transform translate-x-[-60px] translate-y-[0px]"
            />
            <div className="absolute inset-0 bg-white opacity-50 mix-blend-multiply z-10"></div>
          </div>

          {/* Right Part of the form (Form Content) */}
          <div className="w-full lg:w-1/2 p-4 lg:p-4 m-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-3 text-center">SignUp Page</h1>
            <p className="text-gray-600 mb-4 text-center">
              Find your perfect home, where comfort meets convenience. Sign up to explore endless possibilities
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
              <input
                onChange={handleChange}
                value={formData.firstname}
                placeholder="First Name"
                name="firstname"
                className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={handleChange}
                value={formData.lastname}
                placeholder="Last Name"
                name="lastname"
                className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={handleChange}
                type="Email"
                name="Email"
                value={formData.Email}
                placeholder="Email address"
                className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={handleChange}
                type="password"
                name="password"
                value={formData.password}
                placeholder="Set password"
                className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                onChange={handleChange}
                value={formData.confirmPassword}
                placeholder="Confirm Password"
                name="confirmPassword"
                type="password"
                className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                disabled={!passwordMatch || Boolean(error) || loading}
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 mt-6"
              >
                {loading ? 'Signing up...' : 'Sign up free'}
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
      <div className="hidden lg:block lg:w-2/5 relative bg-[#62371B]">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Right content goes here if needed */}
        </div>
      </div>
    </div>
    
  );
};

export default SignUpPage;
