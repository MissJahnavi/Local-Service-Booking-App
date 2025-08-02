// PaymentSuccess.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react'; // optional icon lib

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Booking Confirmed</h2>
        <p className="text-gray-600 mb-4">
          <strong>Service:</strong> Haircut<br />
          <strong>Date:</strong> June 20, 2024<br />
          <strong>Time:</strong> 3:00 PM
        </p>
        <a
          href="/dashboard/user"
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;