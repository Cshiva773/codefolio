// components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Ready to <span className="text-orange-500">unlock</span> your Coding Portfolio?
          </h2>
          <p className="text-xl mb-8">Unlock your codfolio profile now</p>
          <a 
            href="#" 
            className="inline-block px-8 py-4 bg-orange-500 text-white rounded-full text-lg font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Login / Signup →
          </a>
        </div>
        
        <div className="flex justify-center space-x-6 mb-12">
          <a href="#" className="text-3xl text-gray-400 hover:text-orange-500 transition-colors duration-300"><i className='bx bxl-linkedin'></i></a>
          <a href="#" className="text-3xl text-gray-400 hover:text-orange-500 transition-colors duration-300"><i className='bx bxl-facebook'></i></a>
          <a href="#" className="text-3xl text-gray-400 hover:text-orange-500 transition-colors duration-300"><i className='bx bxl-twitter'></i></a>
          <a href="#" className="text-3xl text-gray-400 hover:text-orange-500 transition-colors duration-300"><i className='bx bxl-instagram'></i></a>
        </div>
        
        <div className="flex justify-center space-x-8 mb-8">
          <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">FAQ</a>
          <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Support</a>
          <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Privacy</a>
          <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Timeline</a>
          <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Terms</a>
        </div>
        
        <p className="text-center text-gray-500">© 2024 CodFolio, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;