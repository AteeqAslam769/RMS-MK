import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { appwriteAuthService } from './appwrite/auth';
import { Loader } from './Components';

function ProtectedAuthRoute() {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // Initially null to indicate loading state

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const userData = await appwriteAuthService.checkCurrentUserStatus();
                setIsLoggedIn(userData ? true : false);
            } catch (error) {
                console.error("Error checking login status:", error);
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []); // Empty dependency array to run on mount only

    // Show loader while checking login status
    if (isLoggedIn === null) {
        return <Loader />;
    }

    // If the user is logged in, render the outlet (child components)
    // Otherwise, redirect to login
    return !isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedAuthRoute;
