import React from 'react'
import LoginButton from '../auth/login'
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';

function LandingPage() {
  const { loginWithRedirect,user,isAuthenticated,logout } = useAuth0();
  return (
    <div>
      LandingPage<br/> 
      {
        isAuthenticated ? (
          <>
            <Link to='/dashboard'>
              <button className='mr-4' onClick={()=><Dashboard />}>
                Dashboard 
              </button>
            </Link>
          </>
        ):(
          <>
          </>
        )
      }

      <LoginButton />
    </div>
  )
}

export default LandingPage