
import React from 'react';

export const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="text-sm text-gray-700">
    {children}
  </div>
);

