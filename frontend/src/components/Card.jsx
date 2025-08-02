// import React from 'react';

// const Card = ({ title, value, icon }) => {
//     return (
//         <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
//             <div className="text-blue-600 text-2xl">{icon}</div>
//             <div>
//                 <p className="text-gray-500 text-sm">{title}</p>
//                 <p className="text-xl font-semibold">{value}</p>
//             </div>
//         </div>
//     );
// };

// export default Card;


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

