// components/Hero.js
import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
function Hero() {
  const { loginWithRedirect,user,isAuthenticated, login, logout } = useAuth0();
    
  return (
    <section className="flex items-center min-h-screen bg-gradient-to-br from-orange-100 to-white">
      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-2xl mb-10">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
              Track, Analyze & <span className="text-orange-500">Share</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Build your all-in-one coding portfolio with Codfolio. Showcase your skills, track your progress, and stand out in the tech world.
            </p>
            {
              isAuthenticated ? (
                <a href="/dashboard" className="inline-block px-8 py-4 bg-orange-500 text-white rounded-full text-lg font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Started →
                </a>
              ) : (
                <button className="inline-block px-8 py-4 bg-orange-500 text-white rounded-full text-lg font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Started →
                </button>
              )
            }
            
          </div>
          <div className="w-full max-w-4xl">
            <img 
              src="https://i.ibb.co/KDKBCwh/dashboard.png" 
              alt="Dashboard" 
              className="rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-500 w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;