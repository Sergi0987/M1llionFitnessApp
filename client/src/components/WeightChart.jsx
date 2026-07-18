import { useMemo, useRef, useState } from 'react';
import { formatDate } from '../utils/formatDate.js';

const WIDTH = 640;
const HEIGHT = 220;
const PAD = { top: 16, right: 16, bottom: 28, left: 48 };

export default function WeightChart({ checkins, theme }) {
  const isDark = theme === 'dark';
  const svgRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const points = useMemo(
    () =>
      [...(checkins || [])]
        .filter((checkin) => Number(checkin.weight) > 0)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map((checkin) => ({
          date: checkin.created_at,
          weight: Number(checkin.weight),
        })),
    [checkins],
  );

  const lineColor = isDark ? '#ec4899' : '#db2777';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const labelColor = isDark ? '#94a3b8' : '#64748b';
  const surfaceColor = isDark ? '#0f172a' : '#ffffff';

  if (points.length < 2) {
    return (
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Weight trend appears here after two or more check-ins.
      </p>
    );
  }

  const times = points.map((point) => new Date(point.date).getTime());
  const weights = points.map((point) => point.weight);
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightPad = Math.max((maxWeight - minWeight) * 0.15, 1);
  const yMin = minWeight - weightPad;
  const yMax = maxWeight + weightPad;

  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;

  const xFor = (time) =>
    PAD.left + (maxTime === minTime ? plotWidth / 2 : ((time - minTime) / (maxTime - minTime)) * plotWidth);
  const yFor = (weight) => PAD.top + ((yMax - weight) / (yMax - yMin)) * plotHeight;

  const coords = points.map((point, index) => ({
    ...point,
    x: xFor(times[index]),
    y: yFor(point.weight),
  }));

  const path = coords.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');

  const gridLines = [0, 1, 2, 3].map((step) => {
    const weight = yMin + ((yMax - yMin) * step) / 3;
    return { weight, y: yFor(weight) };
  });

  function handleMove(event) {
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;

    coords.forEach((point, index) => {
      if (Math.abs(point.x - x) < Math.abs(coords[nearest].x - x)) {
        nearest = index;
      }
    });

    setHoverIndex(nearest);
  }

  const hovered = hoverIndex === null ? null : coords[hoverIndex];

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Weight over time from check-ins"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {gridLines.map((line) => (
          <g key={line.y}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={line.y} y2={line.y} stroke={gridColor} strokeWidth="1" />
            <text x={PAD.left - 8} y={line.y + 4} textAnchor="end" fontSize="11" fill={labelColor}>
              {Math.round(line.weight)}
            </text>
          </g>
        ))}

        <text x={PAD.left} y={HEIGHT - 8} fontSize="11" fill={labelColor}>
          {formatDate(points[0].date)}
        </text>
        <text x={WIDTH - PAD.right} y={HEIGHT - 8} textAnchor="end" fontSize="11" fill={labelColor}>
          {formatDate(points[points.length - 1].date)}
        </text>

        {hovered ? (
          <line x1={hovered.x} x2={hovered.x} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke={gridColor} strokeWidth="1" />
        ) : null}

        <path d={path} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {coords.map((point, index) => (
          <circle
            key={`${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            r={hoverIndex === index ? 5 : 3}
            fill={lineColor}
            stroke={surfaceColor}
            strokeWidth="2"
          />
        ))}
      </svg>

      {hovered ? (
        <div
          className={`pointer-events-none absolute -translate-x-1/2 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow ${
            isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'
          }`}
          style={{
            left: `${(hovered.x / WIDTH) * 100}%`,
            top: `${Math.max((hovered.y / HEIGHT) * 100 - 18, 0)}%`,
          }}
        >
          {hovered.weight} lbs · {formatDate(hovered.date)}
        </div>
      ) : null}
    </div>
  );
}
