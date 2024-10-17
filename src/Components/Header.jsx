import React, { useState, useEffect } from 'react';

const Header = ({ userStatus }) => {
  // State to hold the current date and time
  const [currentTime, setCurrentTime] = useState(new Date());

  // useEffect to update the time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Get the current day, date, and time from the state
  const day = currentTime.toLocaleString('en-US', { weekday: 'long' });
  const date = currentTime.toLocaleDateString();
  const time = currentTime.toLocaleTimeString();

  return (
    <header className="text-black bg-white p-4 sticky top-0 z-50 shadow-md w-full">
      <div className="flex justify-between items-center">
        {/* Left: Company Name */}
        <div className="text-2xl font-bold text-blue-700">RMS&nbsp;MK</div> {/* Non-breaking space added */}

        {/* Right: Day, Date, Time, and Status */}
        <div className="hidden md:flex flex-col items-end text-right">
          <div className="text-sm">{day}, {date} | {time}</div>
          <div className="text-xs">Welcome, <span className='font-bold'>{userStatus}</span></div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col items-end w-full text-right">
          <div className="text-base">{day}</div>
          <div className="text-sm">{date} | {time}</div>
          <div className="text-xs">Welcome, <span className='font-bold'>{userStatus}</span></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
