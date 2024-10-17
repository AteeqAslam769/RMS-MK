import React from 'react'
import { Outlet } from 'react-router-dom'
import Login from './Pages/Login'
import { appwriteAuthService } from './appwrite/auth'

function ProtectedRoute() {
    
    const isLoggedIn = appwriteAuthService.checkCurrentUserStatus()
    return(
        isLoggedIn? <Outlet/> : <Login/>
    ) 
}

export default ProtectedRoute