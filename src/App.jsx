import React from 'react';
import Header from './Components/Header';
import Admin_Dashboard from './Components/SuperAdmin/Super_Admin_Sidebar';
import { Outlet } from 'react-router-dom';
import { appwriteAuthService } from './appwrite/auth';


const App = () => {

 appwriteAuthService.checkCurrentUserStatus().then((data)=>console.log(data))

  return (
    <div className="min-h-screen flex flex-col">
      <Header userStatus="Super Admin" />
      <div className="flex flex-grow">
        <Admin_Dashboard />
        <main className="flex-grow md:ml-64 text-2xl bg-gray-100 p-2">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
