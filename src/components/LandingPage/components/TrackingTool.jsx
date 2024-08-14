// components/TrackingTool.js
import React, { useState } from 'react';
function TrackingTool() {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <h2 
            className={`text-4xl font-bold text-center mb-4 transition-all duration-300 ease-in-out
              ${isHovered ? 'animate-gradient-x scale-105' : ''}
              bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent
              hover:text-shadow-glow cursor-pointer`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Comprehensive Tracking Tool
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Monitor your progress, visualize your growth, and identify areas for improvement
          </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-3 bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <img src="https://i.ibb.co/cXW94ng/d4-1.png" alt="Submissions Overview" className="w-full h-auto rounded-lg" />
          </div>
          <div className="col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <img src="https://i.ibb.co/hXm3Ytq/d4-3.png" alt="Badges Overview" className="w-full h-auto rounded-lg" />
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <img src="https://i.ibb.co/25N5Kf7/d4-4.png" alt="Problems Solved Overview" className="w-full h-auto rounded-lg" />
          </div>
          <div className="col-span-3 md:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <img src="https://i.ibb.co/KKYStvy/d4-2.png" alt="Skills Overview" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrackingTool;