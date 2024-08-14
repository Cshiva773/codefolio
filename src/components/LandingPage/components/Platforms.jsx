// components/Platforms.js
import React from 'react';

function Platforms() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">
          Your <span className="text-orange-500">Favourite</span> Coding Platforms
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Streamlined in CodFolio to simplify your coding journey and showcase your skills across multiple platforms.
        </p>
        <div className="flex justify-center items-center">
          <img 
            src="https://i.ibb.co/yFgYprC/Untitled-design.png" 
            alt="Coding Platforms" 
            className="max-w-full h-auto rounded-lg shadow-xl transition-all duration-300 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}

export default Platforms;