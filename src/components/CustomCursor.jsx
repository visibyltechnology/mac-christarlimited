import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let requestRef;
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (hidden) setHidden(false);
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const handleHoverStart = () => setHovered(true);
    const handleHoverEnd = () => setHovered(false);

    const attachHoverEvents = () => {
      document.querySelectorAll('a, button, input, select, .magnetic').forEach(el => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    attachHoverEvents();

    const observer = new MutationObserver(attachHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    const loop = () => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * 0.15;
      ringY += dy * 0.15;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      
      requestRef = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      observer.disconnect();
      cancelAnimationFrame(requestRef);
      document.querySelectorAll('a, button, input, select, .magnetic').forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, [hidden]); // removed position dependency

  if (typeof navigator !== 'undefined' && navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
    return null;
  }

  return (
    <>
      <div 
        ref={dotRef}
        className={`custom-cursor-dot ${hidden ? 'hidden' : ''} ${hovered ? 'hovered' : ''}`}
        style={{ transform: `translate3d(-100px, -100px, 0)` }}
      />
      <div 
        ref={ringRef}
        className={`custom-cursor-ring ${hidden ? 'hidden' : ''} ${hovered ? 'hovered' : ''}`}
        style={{ transform: `translate3d(-100px, -100px, 0)` }}
      />
    </>
  );
}
