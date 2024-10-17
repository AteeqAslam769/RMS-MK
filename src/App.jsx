import React from 'react';
import Header from './Components/Header';
import Admin_Dashboard from './Components/SuperAdmin/Super_Admin_Sidebar';
import { Outlet } from 'react-router-dom';


const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* First render the Header */}
      <Header userStatus="Super Admin" />

      {/* Flex container for Sidebar and Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <Admin_Dashboard />

        {/* Main content */}
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
