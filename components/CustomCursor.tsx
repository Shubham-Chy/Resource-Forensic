
import React, { useEffect, useState } from 'react';

// Fix: Define props interface to include isDarkMode
interface CustomCursorProps {
  isDarkMode?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ isDarkMode = true }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('.clickable')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-200 ease-out"
        style={{
          transform: `translate3d(${position.x - 20}px, ${position.y - 20}px, 0) scale(${isHovering ? 1.5 : 1})`,
        }}
      >
        {/* Fix: Conditional border color based on isDarkMode */}
        <div className={`w-10 h-10 rounded-full border opacity-50 ${isDarkMode ? 'border-white' : 'border-black'}`}></div>
      </div>
      {/* Center dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x - 2}px, ${position.y - 2}px, 0)`,
        }}
      >
        {/* Fix: Conditional background color based on isDarkMode */}
        <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
      </div>
    </>
  );
};

export default CustomCursor;
