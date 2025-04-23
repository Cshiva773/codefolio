import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user and token from localStorage on app load
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        // Handle potential JSON parse errors
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    if (!userData.token) {
      console.error("No token provided in login data");
      return false;
    }
    
    // Store token separately for consistency
    const token = userData.token;
    
    // Ensure the user object has all needed fields
    const userToStore = { 
      ...userData,
      token: undefined // Don't duplicate token in user object
    };
    
    localStorage.setItem("user", JSON.stringify(userToStore));
    localStorage.setItem("authToken", token);

    setUser(userToStore);
    setToken(token);
    
    return true;
  };

  // Signup function
  const signup = async (userData) => {
    try {
      console.log("Sending Signup Data:", userData);
  
      const response = await fetch("https://codefolio-4.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include" // Include cookies if any are set
      });
  
      const data = await response.json();
      console.log("Signup Response:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
  
      if (data.token) {
        console.log("✅ Token Received:", data.token);
  
        // Store the token separately for consistency
        localStorage.setItem("authToken", data.token);
        
        // Store user data without duplicating the token in the user object
        const userToStore = { ...data.user };
        localStorage.setItem("user", JSON.stringify(userToStore));
  
        setUser(userToStore);
        setToken(data.token);
        
        return data;
      } else {
        console.error("Signup failed: No token received!");
        throw new Error("No authentication token received");
      }
    } catch (error) {
      console.error("Signup Error:", error.message);
      throw error;
    }
  };
  
  // Function to check token validity
  const checkTokenValidity = async () => {
    const currentToken = token || localStorage.getItem("authToken");
    
    if (!currentToken) return false;
    
    try {
      const response = await fetch("https://codefolio-4.onrender.com/api/auth/verify-token", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${currentToken}`
        },
        credentials: "include"
      });
      
      return response.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      signup, 
      logout,
      checkTokenValidity 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};