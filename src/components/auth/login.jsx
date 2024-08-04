import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Dashboard from "../dashboard/Dashboard";

const LoginButton = () => {
  const { loginWithRedirect,user,isAuthenticated,logout } = useAuth0();
  console.log("current user",user);
  return(
    <>
      {
        isAuthenticated ? (
          <>
            <Dashboard />
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
              Log Out
            </button>
          </>
        ):(
          <button onClick={() => loginWithRedirect()}>
              Log In
          </button> 
        )
      }
    
    </>

  )
};

export default LoginButton;