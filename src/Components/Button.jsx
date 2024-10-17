import React from 'react';

function Button({
    children,
    type = 'button',
    bgColor = 'bg-blue-500',
    textColor = 'text-white',
    className = '',
    ...props
}) {
    return (
        <button type={type} className={`px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 ${bgColor} ${textColor} ${className}`}{...props}>
            {children}
        </button>
    );
}

export default Button;