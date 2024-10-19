import React, { useEffect } from 'react';
import Header from './Components/Header';
import Admin_Dashboard from './Components/SuperAdmin/Super_Admin_Sidebar';
import { Outlet } from 'react-router-dom';
import { appwriteAuthService } from './appwrite/auth';
import { useDispatch } from 'react-redux';
import { login, logout } from './features/authSlice';
import { documentOperations } from './appwrite/config';
import conf from './config/conf';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const scheduleDailyTask = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0); // Next midnight

      // Calculate time until next midnight
      const timeUntilMidnight = nextMidnight - now;

      // Schedule the task
      setTimeout(() => {
        executeDailyTask(); // Execute your function
        scheduleDailyTask(); // Reschedule for the next day
      }, timeUntilMidnight);
    };

    const executeDailyTask = async () => {
      console.log('Executing daily task...');
      try {
        const today = new Date();
        const day = today.getDate(); // Today's date (1-31)

        // Fetch rental documents from Appwrite
        const data = await documentOperations.getDocuments(conf.appwriteRentInfoCollectionId);

        if (data && data.documents) {
          await Promise.all(data.documents.map(async (rentalProperty) => {
            // Initialize temp variables for calculation
            let tempWallet = rentalProperty.wallet;
            let tempPaymentStatus = rentalProperty.paymentStatus;

            // Check if today is the payment due date
            if (parseInt(rentalProperty.paymentDueDate) === day) {
              // Deduct the monthly rent from the wallet
              tempWallet -= rentalProperty.monthlyRent;

              // Update the payment status based on wallet balance
              if (tempWallet < rentalProperty.securityPaid) {
                tempPaymentStatus = 'Unpaid';
              } else if (tempWallet === rentalProperty.securityPaid) {
                tempPaymentStatus = 'Paid';
              } else if (tempWallet > rentalProperty.securityPaid) {
                tempPaymentStatus = 'Overdue';
              }

              // Update the document in Appwrite
              await documentOperations.updateRentalInfo(
                conf.appwriteRentInfoCollectionId, 
                rentalProperty.$id, 
                {
                  wallet: tempWallet,
                  paymentStatus: tempPaymentStatus,
                }
              );
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching or updating rental documents:', error);
      }
    };

    // Initial user status check
    appwriteAuthService.checkCurrentUserStatus().then((userData) => {
      if (userData) {
        dispatch(login(userData));
      } else {
        dispatch(logout());
      }
    });

    // Start the scheduling
    scheduleDailyTask(); // Start the scheduling for the daily task

  }, [dispatch]); // Add `dispatch` as a dependency for best practice

  return (
    <div className="min-h-screen flex flex-col">
      <Header userStatus="Super Admin" />
      <div className="flex flex-grow">
        <Admin_Dashboard />
        <main className="flex-grow md:ml-64 text-2xl bg-gray-200 p-2">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
