// components/Header.jsx
import React, { useState } from 'react';
import LoginButton from '../../auth/login';
import { useAuth0 } from "@auth0/auth0-react";


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {isAuthenticated,user} = useAuth0();
  const navItems = [
    { name: 'FAQ', href: '#' },
    { name: 'Question Tracker', href: '#' },
    { name: 'Event Tracker', href: '#' },
    { name: 'Profile Tracker', href: '#' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="https://i.ibb.co/QPrj7JX/penguin.png" alt="Codfolio Logo" className="h-10 w-10 mr-2" />
            <span className="text-2xl font-bold text-orange-500">Codfolio</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className="text-gray-800 font-semibold hover:text-orange-500 transition-colors duration-300
                           relative group"
              >
                {item.name}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-orange-500 transform scale-x-0 
                                 group-hover:scale-x-100 transition-transform duration-300 ease-in-out">
                </span>
              </a>
            ))}
          </nav>
          <LoginButton />
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg className="h-6 w-6 fill-current text-gray-500" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
              ) : (
                <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
              )}
            </svg>
          </button>
        </div>
        
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className="block py-2 text-gray-800 font-semibold hover:text-orange-500 
                           transition-colors duration-300"
              >
                {item.name}
              </a>
            ))}
            <div className="mt-2">
              <LoginButton />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;