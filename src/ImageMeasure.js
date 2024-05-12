import React, { useState, useRef, useEffect } from 'react';

function ImageMeasure({ imageUrl }) {
  const imgRef = useRef(null);
  const svgRef = useRef(null);
  const [center, setCenter] = useState({ cx: 200, cy: 200 });
  const [endpoint, setEndpoint] = useState({ ex: 300, ey: 300 });
  const [p1, setP1] = useState(0.8);
  const [radius, setRadius] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingPoint, setDraggingPoint] = useState(null);

  useEffect(() => {
    const dx = endpoint.ex - center.cx;
    const dy = endpoint.ey - center.cy;
    const newRadius = Math.sqrt(dx * dx + dy * dy);
    setRadius(newRadius);
  }, [center, endpoint]);

  const adjustPoints = (t) => ({ x: center.cx + t * (endpoint.ex - center.cx), y: center.cy + t * (endpoint.ey - center.cy) });

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
    } else if (draggingPoint.type === 'p1') {
      const dx = newX - center.cx;
      const dy = newY - center.cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.sqrt((endpoint.ex - center.cx) ** 2 + (endpoint.ey - center.cy) ** 2);
      const newP1 = distance / radius;
      setP1(newP1);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingPoint(null);
  };

  const otherx = center.cx - (endpoint.ex - center.cx);
  const othery = center.cy - (endpoint.ey - center.cy);
  const p1Position = adjustPoints(p1);
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
        <circle cx={p1Position.x} cy={p1Position.y} r="5" fill="yellow"
                onMouseDown={handleMouseDown({type: 'p1', func: setP1})} />
        <circle cx={endpoint.ex} cy={endpoint.ey} r="5" fill="red"
                onMouseDown={handleMouseDown({type: 'endpoint'})} />
      </svg>
      <div>Radius: {radius.toFixed(2)} pixels</div>
    </div>
  );
}

export default ImageMeasure;
