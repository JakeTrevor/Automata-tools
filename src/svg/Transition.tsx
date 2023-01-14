import type { FC } from "react";

interface props {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  label: string;
}

let Transition: FC<props> = ({ fromX, fromY, toX, toY, label }) => {
  let AB = [toX - fromX, toY - fromY];
  let ABlen = Math.sqrt(AB[0] ** 2 + AB[1] ** 2);

  let unitAB = [AB[0] / ABlen, AB[1] / ABlen];
  unitAB = [unitAB[0] * 70, unitAB[1] * 70];

  let P = [fromX + unitAB[0], fromY + unitAB[1]];
  let Q = [toX - unitAB[0], toY - unitAB[1]];

  let [x, y] = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];

  let rotation = (Math.atan2(AB[1], AB[0]) * 180) / Math.PI;

  return (
    <>
      <line
        x1={P[0]}
        y1={P[1]}
        x2={Q[0]}
        y2={Q[1]}
        stroke="black"
        strokeWidth={1}
        markerEnd="url(#triangle)"
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        transform={`translate(${x}, ${y}) rotate(${rotation}) translate(-${x}, -${y})`}
        dominantBaseline="text-after-edge"
        fontFamily="Roboto"
      >
        {label}
      </text>
    </>
  );
};

export default Transition;
