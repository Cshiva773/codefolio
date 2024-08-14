// components/ScrollToTop.js
import React, { useState, useEffect } from 'react';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 text-lg border-none outline-none bg-orange-500 text-black cursor-pointer p-4 rounded-full shadow-lg hover:bg-orange-400 hover:scale-110 transition-all duration-300"
        >
          &#8679;
        </button>
      )}
    </>
  );
}

export default ScrollToTop;