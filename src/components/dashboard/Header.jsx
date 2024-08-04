import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';

function Header() {
  const {user,isAuthenticated}=useAuth0()
  return (
    <div>
      Header
      <h3>hi {user?.name}</h3>
    </div>
  )
}

export default Header