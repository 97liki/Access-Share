import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white shadow rounded-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 