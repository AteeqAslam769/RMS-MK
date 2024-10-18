import React, { useState } from 'react';
import { appwriteAuthService } from '../appwrite/auth.js';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login as storeLogin } from '../features/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Loader } from './index'; // Assuming you have the Input and Loader components

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async (data) => {
        setLoading(true);
        setError('');
        try {
            const session = await appwriteAuthService.login(data);
            if (session) {
                const userData = await appwriteAuthService.checkCurrentUserStatus();
                if (userData) {
                    dispatch(storeLogin(userData));
                    setLoading(false);
                    navigate('/');
                }
            }
        } catch (error) {
            console.error("Error during login: ", error);
            setLoading(false);
            setError(error.message || 'An error occurred during login');
        }
    };

    return (
        loading ? <Loader /> : 
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800">Sign in to your account</h2>
                <p className="text-center text-gray-600">
                    Don't have an account?&nbsp;
                    <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>

                {error && <p className="text-center text-red-600 mt-4">{error}</p>}

                <form onSubmit={handleSubmit(login)} className="space-y-4">
                    <div className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: 'Please enter a valid email address',
                                }
                            })}
                            className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg p-3 w-full`}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters long',
                                }
                            })}
                            className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg p-3 w-full`}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-transform 
                            duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
