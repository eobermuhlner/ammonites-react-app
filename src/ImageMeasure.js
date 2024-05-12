import React, { useState, useRef, useEffect } from 'react';

function ImageMeasure({ imageUrl }) {
  const imgRef = useRef(null);
  const svgRef = useRef(null);
  const [line, setLine] = useState({ x1: 100, y1: 100, x2: 200, y2: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggingPoint, setDraggingPoint] = useState(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    setDistance(dist);
  }, [line]);

  const handleMouseDown = (point) => (event) => {
    setDraggingPoint(point);
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (!isDragging || !draggingPoint || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const newX = event.clientX - svgRect.left;
    const newY = event.clientY - svgRect.top;
    setLine((prevLine) => ({
      ...prevLine,
      [draggingPoint.x]: newX,
      [draggingPoint.y]: newY,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingPoint(null);
  };

  return (
    <div style={{ maxWidth: '90%', maxHeight: '90%', position: 'relative' }}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}>
      <img ref={imgRef} src={imageUrl} style={{ width: '100%', height: 'auto' }} alt="Measured" />
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <line
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="red"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <circle cx={line.x1} cy={line.y1} r="5" fill="blue"
                onMouseDown={handleMouseDown({x: 'x1', y: 'y1'})} />
        <circle cx={line.x2} cy={line.y2} r="5" fill="blue"
                onMouseDown={handleMouseDown({x: 'x2', y: 'y2'})} />
      </svg>
      <div>Distance: {distance.toFixed(2)} pixels</div>
    </div>
  );
}

export default ImageMeasure;
