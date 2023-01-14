import type { FC } from "react";

interface props {
  x: number;
  y: number;
  name: string;
}

let Rejecting: FC<props> = ({ x, y, name }) => {
  return (
    <>
      <circle cx={x} cy={y} fill="none" r={50} stroke="black" strokeWidth={1} />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Roboto"
      >
        {name}
      </text>
    </>
  );
};

export default Rejecting;
