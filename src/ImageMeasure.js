import React, { useState, useRef, useEffect } from 'react';

function ImageMeasure({ imageUrl }) {
  const imgRef = useRef(null);
  const svgRef = useRef(null);
  const [center, setCenter] = useState({ cx: 150, cy: 150 });
  const [endpoint, setEndpoint] = useState({ ex: 300, ey: 300 });
  const [radius, setRadius] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingPoint, setDraggingPoint] = useState(null);

  useEffect(() => {
    const dx = endpoint.ex - center.cx;
    const dy = endpoint.ey - center.cy;
    const newRadius = Math.sqrt(dx * dx + dy * dy);
    setRadius(newRadius);
  }, [center, endpoint]);

  const handleMouseDown = (point) => (event) => {
    setDraggingPoint(point);
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (!isDragging || !draggingPoint || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const newX = event.clientX - svgRect.left;
    const newY = event.clientY - svgRect.top;
    if (draggingPoint.type === 'center') {
      setCenter({ cx: newX, cy: newY });
    } else if (draggingPoint.type === 'endpoint') {
      setEndpoint({ ex: newX, ey: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingPoint(null);
  };

  const otherx = center.cx - (endpoint.ex - center.cx)
  const othery = center.cy - (endpoint.ey - center.cy)
  return (
    <div style={{ maxWidth: '90%', maxHeight: '90%', position: 'relative' }}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}>
      <img ref={imgRef} src={imageUrl} style={{ width: '100%', height: 'auto' }} alt="Measured" />
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <circle cx={center.cx} cy={center.cy} r={radius} stroke="green" strokeWidth="2" fill="transparent" />
        <line x1={otherx} y1={othery} x2={endpoint.ex} y2={endpoint.ey} stroke="blue" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <circle cx={center.cx} cy={center.cy} r="5" fill="red"
                onMouseDown={handleMouseDown({type: 'center'})} />
        <circle cx={endpoint.ex} cy={endpoint.ey} r="5" fill="red"
                onMouseDown={handleMouseDown({type: 'endpoint'})} />
      </svg>
      <div>Radius: {radius.toFixed(2)} pixels</div>
    </div>
  );
}

export default ImageMeasure;
