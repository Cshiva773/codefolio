import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Dashboard from "../dashboard/Dashboard";

const LoginButton = () => {
  const { loginWithRedirect,user,isAuthenticated, logout } = useAuth0();
  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      loginWithRedirect();
    }
  };
  return(
    <>
      <button
      onClick={handleAuth}
      className="px-6 py-2 bg-orange-500 text-white font-bold rounded-full 
                 hover:bg-orange-600 transition-colors duration-300 transform hover:scale-105"
    >
      {isAuthenticated ? "Log Out" : "Log In"}
    </button>
    
    </>

  )
};

export default LoginButton;