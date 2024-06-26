import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ImageMeasure({ imageUrl, width, height, countPrimaryRibs, turns, onUpdateN, onUpdateH }) {
  const imgRef = useRef(null);
  const svgRef = useRef(null);
  const [center, setCenter] = useState({ cx: 0, cy: 0 });
  const [endpoint, setEndpoint] = useState({ ex: 0, ey: 0 });
  const [p1, setP1] = useState(-0.7);
  const [p2, setP2] = useState(0.4);
  const [p3, setP3] = useState(-0.2);
  const [pRib, setPRib] = useState(0.6);
  const [radius, setRadius] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingPoint, setDraggingPoint] = useState(null);
  const [N, setN] = useState(0);
  const [H, setH] = useState(0);
  const { t } = useTranslation();

  // Initialize center and endpoint based on image size
  useEffect(() => {
    if (imgRef.current) {
      const imgWidth = imgRef.current.width;
      const imgHeight = imgRef.current.height;
      const cx = imgWidth / 2;
      const cy = imgHeight / 2;
      const ex = cx + (imgWidth / 4);
      const ey = cy + (imgHeight / 4);
      setCenter({ cx, cy });
      setEndpoint({ ex, ey });
    }
  }, [imgRef.current?.width, imgRef.current?.height]);

  useEffect(() => {
    const dx = endpoint.ex - center.cx;
    const dy = endpoint.ey - center.cy;
    setRadius(Math.sqrt(dx * dx + dy * dy));
  }, [center, endpoint]);

  useEffect(() => {
    if (p1 !== 0 && p1 !== 1) {
      const nValue = ((p2 - p3) / (1.0 - p1) * 100).toFixed(1);
      const hValue = ((1.0 - p2) / (1.0 - p1) * 100).toFixed(1);
      setN(nValue);
      setH(hValue);
      if (onUpdateN) {
        onUpdateN(nValue);
      }
      if (onUpdateH) {
        onUpdateH(hValue);
      }
    }
  }, [p1, p2, p3, onUpdateN, onUpdateH]);

  const adjustPoints = (t) => ({ x: center.cx + t * (endpoint.ex - center.cx), y: center.cy + t * (endpoint.ey - center.cy) });

  const handleMouseDown = (point) => (event) => {
    setDraggingPoint(point);
    setIsDragging(true);
  };

  const calculateDiameterPoint = (newX, newY, center, endpoint) => {
    const dx = newX - center.cx;
    const dy = newY - center.cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.sqrt((endpoint.ex - center.cx) ** 2 + (endpoint.ey - center.cy) ** 2);
    return distance / radius;
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
      setP1(-calculateDiameterPoint(newX, newY, center, endpoint));
    } else if (draggingPoint.type === 'p2') {
      setP2(calculateDiameterPoint(newX, newY, center, endpoint));
    } else if (draggingPoint.type === 'p3') {
      setP3(-calculateDiameterPoint(newX, newY, center, endpoint));
    } else if (draggingPoint.type === 'pRib') {
      setPRib(calculateDiameterPoint(newX, newY, center, endpoint));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingPoint(null);
  };

  const renderPurpleLines = (n, center, endpoint, radius) => {
    const deltaX = endpoint.ex - center.cx;
    const deltaY = endpoint.ey - center.cy;
    const initialAngle = Math.atan2(deltaY, deltaX);

    const angleIncrement = (2 * Math.PI) / n;
    let lines = [];

    for (let i = 0; i < n; i++) {
      const angle = initialAngle + angleIncrement * i;
      const lineEndX = center.cx + radius * Math.cos(angle);
      const lineEndY = center.cy + radius * Math.sin(angle);

      lines.push(
          <line
              key={`purple-line-${i}`}
              x1={center.cx}
              y1={center.cy}
              x2={lineEndX}
              y2={lineEndY}
              stroke="purple"
              strokeWidth="1"
          />
      );
    }
    return lines;
  };

  const parseDimension = (dim, ref) => {
    if (typeof dim === 'string' && dim.endsWith('%')) {
      return `${dim}`;
    }
    return `${dim}px`;
  };

  const imageStyles = {
    width: parseDimension(width, imgRef.current),
    height: parseDimension(height, imgRef.current),
    objectFit: 'contain',
    cursor: 'pointer'
  };

  const otherx = center.cx - (endpoint.ex - center.cx);
  const othery = center.cy - (endpoint.ey - center.cy);
  const p1Position = adjustPoints(p1);
  const p2Position = adjustPoints(p2);
  const p3Position = adjustPoints(p3);
  const pRibPosition = adjustPoints(pRib);

  const turnCount = turns;
  const numPoints = 300;
  const spiralPoints = [];
  let startAngle = 0;

  let dx = endpoint.ex - center.cx;
  let dy = endpoint.ey - center.cy;
  let endpointAngle = Math.atan2(dy, dx);

  let finalAngle = startAngle + turnCount * 2 * Math.PI + endpointAngle;

  let startRadius = radius * 0.01;
  const growthRate = Math.log(radius / startRadius) / numPoints;

  for (let i = 0; i < numPoints; i++) {
    let angle = startAngle + (i / numPoints) * (finalAngle - startAngle);
    let r = startRadius * Math.exp(growthRate * i);
    let x = center.cx + r * Math.cos(angle);
    let y = center.cy + r * Math.sin(angle);
    spiralPoints.push(`${x},${y}`);
  }

  return (
      <div
          style={{ width: '100%', height: '100%', position: 'relative' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
      >
        <img ref={imgRef} src={imageUrl} style={imageStyles} alt={t('imageMeasure.alt')} />
        <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <circle cx={center.cx} cy={center.cy} r={radius} stroke="green" strokeWidth="2" fill="transparent" />
          <circle cx={center.cx} cy={center.cy} r={radius * pRib} stroke="purple" strokeWidth="2" fill="transparent" />
          <polyline points={spiralPoints.join(' ')} fill="none" stroke="orange" strokeWidth="2" />
          {renderPurpleLines(countPrimaryRibs, center, endpoint, radius)}
          <line x1={otherx} y1={othery} x2={endpoint.ex} y2={endpoint.ey} stroke="blue" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <circle cx={center.cx} cy={center.cy} r="5" fill="red" onMouseDown={handleMouseDown({ type: 'center' })} />
          <circle cx={endpoint.ex} cy={endpoint.ey} r="8" fill="red" onMouseDown={handleMouseDown({ type: 'endpoint' })} />
          <circle cx={p1Position.x} cy={p1Position.y} r="5" fill="red" onMouseDown={handleMouseDown({ type: 'p1', func: setP1 })} />
          <circle cx={p2Position.x} cy={p2Position.y} r="5" fill="yellow" onMouseDown={handleMouseDown({ type: 'p2', func: setP2 })} />
          <circle cx={p3Position.x} cy={p3Position.y} r="5" fill="yellow" onMouseDown={handleMouseDown({ type: 'p3', func: setP3 })} />
          <circle cx={pRibPosition.x} cy={pRibPosition.y} r="5" fill="purple" onMouseDown={handleMouseDown({ type: 'pRib', func: setPRib })} />
        </svg>
      </div>
  );
}

export default ImageMeasure;
