import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams for accessing URL parameters
import { documentOperations } from '../appwrite/config'; // Import your Appwrite document operations
import conf from '../config/conf'; // Appwrite configuration

const RentalDetails = () => {
  const  propertyId  = useParams(); // Get property ID from URL parameters
  const [rentalInfo, setRentalInfo] = useState(null); // State to hold rental details
  const [PropertyInfo, setPropertyInfo] = useState(null);
  const [loading, setLoading] = useState(true); // State to handle loading state

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
       
        
        const rentalDetailResponse = await documentOperations.getDocument(
          conf.appwriteRentInfoCollectionId,
          propertyId.slug
        );


        if (rentalDetailResponse) {
          setRentalInfo(rentalDetailResponse); // Set the fetched rental details
          
          const PropertyDetailResponse = await documentOperations.getDocument(
            conf.appwritePropertyInfoCollectionId,
            rentalDetailResponse.propertyId
          );
          if(PropertyDetailResponse){
            setPropertyInfo(PropertyDetailResponse)
            
          }
        }
      } catch (error) {
        console.error('Error fetching rental details:', error);
      } finally {
        setLoading(false); // Stop the loader after fetching data
      }
    };

    fetchRentalDetails();
  }, [propertyId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    
    return date.toLocaleDateString(undefined, options); // You can specify a locale if needed
  };

  // Loader while fetching data
  if (loading) {
    return <div>Loading...</div>; // You can replace this with your Loader component
  }

  // Handle case where rental info is not found
  if (!rentalInfo) {
    return <div className="text-center">No rental details found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Rental Details</h1>

      {/* Property Information */}
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Property Information</h2>
        <p><strong>Property Name:</strong> {PropertyInfo.propertyName}</p>
        <p><strong>Property Type:</strong> {PropertyInfo.propertyType}</p>
        <p><strong>Location:</strong> {PropertyInfo.location}</p>
        <p><strong>Number of Beds:</strong> {PropertyInfo.numberOfBedrooms}</p>
        <p><strong>Number of Bathrooms:</strong> {PropertyInfo.numberOfBathrooms}</p>
        <p><strong>Property Size:</strong> {PropertyInfo.propertySize} sq ft</p>
        <p><strong>Furnished:</strong> {PropertyInfo.furnished ? 'Yes' : 'No'}</p>
        <p><strong>Security Amount Required:</strong> ${PropertyInfo.securityAmount}</p>
        <p><strong>Property Description:</strong> {PropertyInfo.propertyDescription}</p>
      </div>

      {/* Renter Information */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Renter Information</h2>
        <p><strong>Renter Name:</strong> {rentalInfo.renterName}</p>
        <p><strong>Renter Contact:</strong> {rentalInfo.renterContact}</p>
        <p><strong>Start Date:</strong> {formatDate(rentalInfo.rentStartDate)}</p>
        <p><strong>End Date:</strong> {formatDate(rentalInfo.rentEndDate)}</p>
        <p><strong>Monthly Rent:</strong> ${rentalInfo.monthlyRent}</p>
        <p><strong>Payment Due Date:</strong> {rentalInfo.paymentDueDate}</p>
        <p><strong>Security Paid:</strong> ${rentalInfo.securityPaid}</p>
        <p><strong>Total Amount Paid:</strong> ${rentalInfo.totalAmountPaid}</p>
        <p>
          <strong>Payment Status:</strong>
          <span className={`ml-1 font-bold ${rentalInfo.paymentStatus === 'Paid' ? 'text-green-500' : rentalInfo.paymentStatus === 'Overdue' ? 'text-red-500' : 'text-yellow-500'}`}>
            {rentalInfo.paymentStatus}
          </span>
        </p>
        <p><strong>Entry Operator:</strong> {rentalInfo.entryOperator}</p>
        <p><strong>Wallet:</strong> ${rentalInfo.wallet}</p>
      </div>
    </div>
  );
};

export default RentalDetails;
