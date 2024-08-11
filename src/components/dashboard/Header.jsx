import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import {BsFillBellFill, BsFillEnvelopeFill, BsJustify, BsPersonCircle, BsSearch} from 'react-icons/bs'
function Header({OpenSidebar}) {
  const {user,isAuthenticated}=useAuth0()
  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar}/>
      </div>
      <div className='header-left'>
            {/* <BsSearch  className='icon'/> */}
           
        </div>
      <div className='header-right flex flex-col-2'>
          <h3>Hi, {user?.name}</h3>
          <div className='ml-2'><BsPersonCircle className='icon'/></div>
          
        </div>
    </header>
  )
}

export default Header