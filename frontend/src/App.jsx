import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Signin from './components/Signin'
import { createBrowserRouter, RouterProvider, BrowserRouter } from 'react-router-dom'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import Home from './components/Home'
import BrowseServices from './components/BrowseServices'
import UserDashboard from './components/UserDashboard'
import BusinessDashboard from './components/BusinessDashboard'
import AdminDashboard from './components/AdminDashboard'
import UserBookingsTab from './components/UserBookingsTab'
import Paymentsuccess from './components/Paymentsuccess'
import PaymentFailure from './components/Paymentfailure'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    }, {
      path: "/signin",
      element: <Signin />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/browseServices",
      element: <BrowseServices />
    },
    {
      path: "/userDashboard",
      element: <UserDashboard />
    },
    {
      path: "/businessDashboard",
      element: < BusinessDashboard/>
    },
    {
      path: "/adminDashboard",
      element: < AdminDashboard/>
    },
    {
      path: "/paymentsuccess",
      element: <Paymentsuccess />
    },
    {
      path: "/paymentfailure",
      element: <PaymentFailure />
    },
    {
      path:"/navbar",
      element:<Navbar/>
    },
    {
      path:"/userBookings",
      element:<UserBookingsTab/>
    }
  ])

  return (
    <>

      <RouterProvider router={router} />
    </>
  )
}
 

export default App
