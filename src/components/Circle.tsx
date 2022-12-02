import React from 'react';
import './rotate.css';

const Circle: React.FC<{}> = () => {
  return (
    <div className="rounded-full h-48 w-48 border-4 border-blue-600 mt-10 mx-auto flex justify-center items-center">
      <div className="rounded-full h-10 w-10 bg-green-700 orbit1">
        <div className="rounded-full h-10 w-10 bg-green-700 orbit2"></div>
      </div>
    </div>
  );
};

export default Circle;
