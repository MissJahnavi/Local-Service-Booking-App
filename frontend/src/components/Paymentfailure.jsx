// PaymentFailure.jsx
import React from 'react';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-4">
          Something went wrong. Please try again or contact support.
        </p>
        <div className="space-y-2">
          <button
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
            onClick={() => window.location.href = '/retry-payment'}
          >
            Retry Payment
          </button>
          <button
            className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;