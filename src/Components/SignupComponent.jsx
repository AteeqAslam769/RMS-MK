import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { appwriteAuthService } from '../appwrite/auth';
import { Input, Loader } from './index';

function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signup = async (data) => {
        setLoading(true);
        setError('');
        try {
            let userData = await appwriteAuthService.signUp(data);
            if (userData) {
                setLoading(false);
                alert('Your Account is created successfully.')
                navigate('/login');
            }
        } catch (error) {
            setError(error.message || 'An error occurred during signup');
            setLoading(false);
        }
    };

    return (
        loading ? <Loader /> :
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800">Sign up to create an account</h2>
                <p className="text-center text-gray-600">
                    Already have an account?&nbsp;
                    <Link to="/login" className="font-medium text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </p>

                {error && <p className="text-center text-red-600 mt-4">{error}</p>}

                <form onSubmit={handleSubmit(signup)} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            {...register('name', {
                                required: 'Full Name is required',
                                pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: 'Full Name can only contain letters and spaces'
                                }
                            })}
                            className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-300'} 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg p-3 w-full`}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: 'Please enter a valid email address'
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
                                    message: 'Password must be at least 8 characters long'
                                }
                            })}
                            className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg p-3 w-full`}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full text-white font-bold py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700`}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
