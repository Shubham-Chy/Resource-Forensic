
import React, { useEffect, useState } from 'react';

interface CustomCursorProps {
  isDarkMode?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ isDarkMode = true }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isSystemOverlayActive, setIsSystemOverlayActive] = useState(false);

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

    // Check if high-priority system overlays (Security Gate, Loading Screen) are active
    const checkOverlayState = () => {
      const hasOverlay = !!document.querySelector('[data-forensic-overlay]');
      setIsSystemOverlayActive(hasOverlay);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    
    // Check every second for dynamic overlay changes
    const interval = setInterval(checkOverlayState, 1000);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      clearInterval(interval);
    };
  }, []);

  // System overlays are always black, so we force a white cursor (darkMode styles)
  const effectiveDarkMode = isSystemOverlayActive ? true : isDarkMode;

  return (
    <>
      {/* Outer ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[20000] transition-transform duration-200 ease-out"
        style={{
          transform: `translate3d(${position.x - 20}px, ${position.y - 20}px, 0) scale(${isHovering ? 1.5 : 1})`,
        }}
      >
        <div className={`w-10 h-10 rounded-full border opacity-50 transition-colors duration-500 ${effectiveDarkMode ? 'border-white' : 'border-black'}`}></div>
      </div>
      {/* Center dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[20000] transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x - 2}px, ${position.y - 2}px, 0)`,
        }}
      >
        <div className={`w-1 h-1 rounded-full transition-colors duration-500 ${effectiveDarkMode ? 'bg-white' : 'bg-black'}`}></div>
      </div>
    </>
  );
};

export default CustomCursor;
