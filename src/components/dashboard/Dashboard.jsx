import React from 'react'
import Home from './Home'
import Sidebar from './Sidebar'
import Header from './Header'
import CodingProfile from './SideBar/Codingprofile'

function Dashboard() {
  return (
    <div>
        <Header />
        <Home />
        <Sidebar />
        <CodingProfile />
    </div>
  )
}

export default Dashboard