import React, { useState, useEffect } from 'react';
import { blogOperations } from '../../appwrite/config';
import { collections } from '../../config/collection';
import Loader from '../Loader/Loader';

const Expenses = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogOperations
      .getDocuments()
      .then((expenses) => {
        if (expenses) setData(expenses.documents);
      })
      .finally(() => setLoading(false));
  }, []);

  // Sort the data: Pending first, Accepted second, Rejected last
  const sortedData = [...data].sort((a, b) => {
    const statusOrder = {
      Pending: 1,
      Accepted: 2,
      Rejected: 3,
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className="flex flex-wrap justify-evenly gap-6 py-5 ">
        {sortedData.length === 0 ? (
          <div className="flex items-center justify-center w-full h-screen">
            <p className="text-xl text-gray-500">No expense requests yet.</p>
          </div>
        ) : (
          sortedData.map((expense, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 w-80 sm:w-60 md:w-80 lg:w-96 h-auto flex flex-col">
              {/* Requester Info */}
              <div className="mb-6">
                <h2 className="text-xl text-center font-bold">{expense.requesterName}</h2>
                <p className="text-sm text-center text-gray-500">Invoice #{expense.invoiceNumber}</p>
              </div>

              {/* Entry Operator Info */}
              <div className="mb-2">
                <p className=" text-lg text-gray-500">Entry Operator: <span className='font-bold'>{expense.entryOperator}</span></p>
              </div>

              {/* Amount & Due Date */}
              <div className="mb-2">
                <h3 className="text-lg font-semibold">Amount Requested: {expense.amount}$</h3>

                {expense.dueDate && (
                  <p className="text-sm text-gray-500">Due Date: {expense.dueDate}</p>
                )}
              </div>

              {/* Reason */}
              <p className="text-gray-700 mb-2 text-2xl">{expense.reason}</p>

              {/* Status */}
              <p className={`text-sm font-semibold mb-2 ${
                  expense.status === 'Pending' ? 'text-yellow-500' : 
                  expense.status === 'Accepted' ? 'text-green-500' : 
                  'text-red-500'
                }`}>
                Status: {expense.status}
              </p>
              <p className="text-sm text-gray-400">Requested on: {expense.requestDate}</p>

              {/* Empty space to push buttons to the bottom */}
              <div className="flex-grow" />

              {/* Acceptance/Rejection Date */}
              {(expense.status === 'Accepted' || expense.status === 'Rejected') && (
                <div className="flex items-center mt-8">
                  <p className="text-sm text-gray-400">
                    {expense.status} on: <span className=' font-bold'>{expense.decisionDate}</span>
                  </p>
                </div>
              )}

              {/* Actions (Optional based on user role) */}
              <div className="flex  space-x-2 mt-4">
                {expense.status === 'Pending' && (
                  <>
                    <button className="bg-green-500 text-white px-4 py-2 text-sm rounded-md">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 text-sm rounded-md">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
};

export default Expenses;
