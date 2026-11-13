import React from 'react';

export type CustomProgressValue = 0 | 1 | 2 | 3;

interface CustomProgressProps {
  /** Количество заполненных сегментов: 0 — все серые, 3 — все жёлтые */
  value: CustomProgressValue;
}

// Цвета
const COLOR_EMPTY = '#727272';
const COLOR_FILLED = '#FFA726'; // оранжевый для 1/3 и 2/3
const COLOR_COMPLETE = '#FFC107'; // жёлтый для 3/3

const SIZE = 32;
const CENTER = SIZE / 2;
const RADIUS = 12;
const STROKE_WIDTH = 3.5;

/**
 * Вычисляет параметры дуги SVG для одного сегмента.
 * startAngle и endAngle — в градусах, 0 = верхняя точка (12 часов), по часовой стрелке.
 */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngleDeg: number,
  endAngleDeg: number,
): string {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngleDeg));
  const y1 = cy + r * Math.sin(toRad(startAngleDeg));
  const x2 = cx + r * Math.cos(toRad(endAngleDeg));
  const y2 = cy + r * Math.sin(toRad(endAngleDeg));
  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

// Три сегмента: зазор между ними ~8°
// Сегмент 1 (левый, большой):  от 210° до 330°  → ~120° дуга + зазоры → итого ~170°
// Сегмент 2 (правый нижний):   от 340° до 90°   → ~110°
// Сегмент 3 (правый верхний):  от 100° до 200°  → ~100°
//
// Углы подобраны так, чтобы сегмент 1 занимал ~левую половину,
// сегмент 2 и 3 делили правую половину пополам (нижний и верхний).
const GAP = 10; // градусов зазора с каждой стороны

const SEGMENTS = [
  // Левый большой (от нижнего правого до верхнего правого, через левую сторону)
  { start: 215, end: 325 },   // ~110° → чуть меньше полукруга
  // Правый нижний
  { start: 335, end: 85 },    // ~110° (переходит через 0°)
  // Правый верхний
  { start: 95, end: 205 },    // ~110°
] as const;

export const CustomProgress: React.FC<CustomProgressProps> = ({ value }) => {
  const fillColor = value === 3 ? COLOR_COMPLETE : COLOR_FILLED;

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-label={`Прогресс ${value} из 3`}
    >
      {SEGMENTS.map((seg, i) => {
        const filled = i < value;
        return (
          <path
            key={i}
            d={describeArc(CENTER, CENTER, RADIUS, seg.start, seg.end)}
            fill="none"
            stroke={filled ? fillColor : COLOR_EMPTY}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
