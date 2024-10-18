import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Login from './Pages/Login'
import { appwriteAuthService } from './appwrite/auth'

function ProtectedRoute() {
    
    const [isLoggedIn,setIsLoggedIn] = useState(false) 
    appwriteAuthService.checkCurrentUserStatus().then((data)=>setIsLoggedIn(data))
    return(
        isLoggedIn? <Outlet/> : <Login/>
    ) 
}

export default ProtectedRoute