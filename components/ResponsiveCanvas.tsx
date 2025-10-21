'use client';
import { useEffect, useRef, useState } from 'react';

interface ResponsiveCanvasProps {
  children: (width: number, height: number) => React.ReactNode;
  aspectRatio?: number; // width/height ratio, default 700/360 ≈ 1.94
  minWidth?: number;
  maxWidth?: number;
  className?: string;
}

export default function ResponsiveCanvas({ 
  children, 
  aspectRatio = 700/360, 
  minWidth = 300,
  maxWidth = 1000,
  className = ''
}: ResponsiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 360 });

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const availableWidth = Math.min(Math.max(containerWidth, minWidth), maxWidth);
      const width = availableWidth;
      const height = Math.round(width / aspectRatio);
      
      setDimensions({ width, height });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [aspectRatio, minWidth, maxWidth]);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <div className="flex justify-center">
        {children(dimensions.width, dimensions.height)}
      </div>
    </div>
  );
}
