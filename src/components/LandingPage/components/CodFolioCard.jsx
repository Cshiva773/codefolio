// components/CodFolioCard.js
import React from 'react';

function CodFolioCard() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-100 to-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Share your <span className="text-orange-500">#CodFolioCard</span> Everywhere
        </h2>

        <div className="flex justify-center">
          <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
            <img 
              src="https://i.ibb.co/1LDLndd/d6.png" 
              alt="CodFolio Card" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CodFolioCard;