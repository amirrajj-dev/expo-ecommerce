import React from 'react'
import { Outlet } from 'react-router'

const DashboardLayout = () => {
  return (
    <div>
        <h1 className='text-3xl'>DashboardLayout</h1>
        <h2 className='text-xl'>navbar</h2>
        <Outlet/>
    </div>
  )
}

export default DashboardLayout