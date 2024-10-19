import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Loader from '../Loader/Loader';
import { documentOperations } from '../../appwrite/config'; // Import your Appwrite document operations
import conf from '../../config/conf'; // Appwrite configuration

const Rent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch property documents from the first collection
        const propertyResponse = await documentOperations.getDocuments(conf.appwritePropertyInfoCollectionId);
        const rentalDetailResponse = await documentOperations.getDocuments(conf.appwriteRentInfoCollectionId);

        if (
          propertyResponse &&
          propertyResponse.documents &&
          rentalDetailResponse &&
          rentalDetailResponse.documents
        ) {
          // Create a mapping of rental details by property ID for easy access
          const rentalDetailsMap = rentalDetailResponse.documents.reduce((acc, detail) => {
            acc[detail.propertyId] = detail; // Using propertyId to map details
            return acc;
          }, {});

          // Combine the two datasets based on property ID
          const combinedData = propertyResponse.documents.map((property) => {
            const rentalDetails = rentalDetailsMap[property.$id] || {}; // Find corresponding rental details
            return {
              ...property,
              ...rentalDetails, // Merge the two objects
            };
          });

          setData(combinedData); // Set the combined data
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        setLoading(false); // Stop the loader after fetching data
      }
    };

    fetchData();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    
    return date.toLocaleDateString(undefined, options); // You can specify a locale if needed
  };

  // Function to get payment status class
  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'text-green-500'; // Green for paid
      case 'Unpaid':
        return 'text-yellow-500'; // Yellow for unpaid
      case 'Overdue':
        return 'text-red-500'; // Red for overdue
      default:
        return 'text-gray-500'; // Default color
    }
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className="flex flex-wrap justify-evenly gap-6 py-5">
        {data.length === 0 ? (
          <div className="flex items-center justify-center w-full h-screen">
            <p className="text-xl text-gray-500">No property records available.</p>
          </div>
        ) : (
          data.map((property) => (
            <Link key={property.$id} to={`${property.$id}`} className="block"> {/* Use document ID as key */}
              <div className="bg-white shadow-lg rounded-lg p-6 w-80 sm:w-60 md:w-80 lg:w-96 h-auto flex flex-col">
                {/* Property Info */}
                <div className="mb-4">
                  <h2 className="text-xl text-center font-bold">{property.propertyName}</h2>
                  <p className="text-base text-center font-bold text-gray-500">Type: {property.propertyType || 'Unknown'}</p>
                  <p className="text-sm text-center text-gray-400">Location: {property.location || 'No location'}</p>
                </div>

                {/* Rental Details */}
                <div className="mb-4">
                  <p className="text-lg text-gray-500">Renter Name: <span className="font-bold">{property.renterName || 'N/A'}</span></p>
                  <p className="text-lg text-gray-500">Start Date: <span className="font-bold">{formatDate(property.rentStartDate)}</span></p>
                  <p className="text-lg text-gray-500">Monthly Rent: <span className="font-bold">${property.monthlyRent || 0}</span></p>
                  <p className={`text-lg ${getPaymentStatusClass(property.paymentStatus)}`}>Payment Status: <span className="font-bold">{property.paymentStatus || 'N/A'}</span></p>
                  <p className="text-lg text-gray-500">Entry Operator: <span className="font-bold">{property.entryOperator || 'N/A'}</span></p>
                </div>

                {/* Empty space to push additional info to the bottom */}
                <div className="flex-grow" />
              </div>
            </Link>
          ))
        )}
      </div>
    );
  }
};

export default Rent;
