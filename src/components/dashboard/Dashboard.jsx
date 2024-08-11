import React from 'react'
import { useState } from 'react'
import './App.css'
import Home from './Home'
import Sidebar from './Sidebar'
import Header from './Header'
import CodingProfile from './SideBar/Codingprofile'

function Dashboard() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  return (
    <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar}/>
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
        <Home />

    </div>
  )
}

export default Dashboard
{/* <CodingProfile /> */}