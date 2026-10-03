import React, { useEffect, useState } from 'react';

export default function CyberCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    let animationFrame;
    const updateFollower = () => {
      setFollowerPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18
      }));
      animationFrame = requestAnimationFrame(updateFollower);
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'A' ||
        e.target.tagName === 'INPUT' ||
        e.target.closest('.dropzone-cyber') ||
        e.target.closest('.dock-item') ||
        e.target.closest('.glass-3d')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    animationFrame = requestAnimationFrame(updateFollower);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrame);
    };
  }, [pos]);

  return (
    <>
      <div
        className="custom-cursor"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`,
          backgroundColor: isHovering ? 'var(--neon-cyan)' : 'var(--neon-emerald)'
        }}
      />
      <div
        className="cursor-follower"
        style={{
          left: `${followerPos.x}px`,
          top: `${followerPos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.6 : 1})`,
          borderColor: isHovering ? 'rgba(6, 182, 212, 0.6)' : 'rgba(16, 185, 129, 0.35)'
        }}
      />
    </>
  );
}
