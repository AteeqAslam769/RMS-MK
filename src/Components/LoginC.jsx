import React, { useState } from 'react';
import { appwriteAuthService } from '../appwrite/auth';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login as storelogin } from '../features/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Loader } from './index';

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async (data) => {
        setLoading(true)
        setError('');
        try {
            const session = await appwriteAuthService.login(data);
            if (session) {
                const userData = await appwriteAuthService.checkCurrentUserStatus();
                if (userData) {
                    dispatch(storelogin(userData));
                    setLoading(false)
                    navigate('/');
                }
            }
        } catch (error) {
            console.log("Error during login: ", error);
            setError(error.message || 'An error occurred during login');
        }
    };

    return (
        loading?<Loader/>:
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
                <div className="flex justify-center">
                    
                </div>
                <h2 className="text-2xl font-bold text-center">Sign in to your account</h2>
                <p className="mt-2 text-center text-gray-600">
                    Don't have an account?&nbsp;
                    <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
                {error && <p className="mt-4 text-center text-red-600">{error}</p>}
                <form onSubmit={handleSubmit(login)} className="mt-8 space-y-6">
        <div className="space-y-4">
            <Input
                label="Email"
                type="email"
                placeholder="Enter Email"
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Email address must be a valid address'
                    }
                })}
                className={`bg-gray-200 focus:bg-white border-gray-300 focus:border-blue-500 rounded-md py-2 px-4 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            <Input
                label="Password"
                type="password"
                placeholder="Enter Password"
                {...register('password', {
                    required: 'Password is required',
                    minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters long'
                    }
                })}
                className={`bg-gray-200 focus:bg-white border-gray-300 focus:border-blue-500 rounded-md py-2 px-4 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" text='Login'>
            Sign in
        </Button>
    </form>

            </div>
        </div>
    );
}

export default Login;