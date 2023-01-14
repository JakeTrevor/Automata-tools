import type { FC } from "react";
import Accepting from "./Accepting.js";
import Rejecting from "./Rejecting.js";
import Transition from "./Transition.js";

const minDistance = 350;
const pad = 50;

interface props {
  machine: FSM;
}

let StateCircle: FC<props> = ({ machine }) => {
  let states = Object.keys(machine.nodes);

  let angularSeparation = (2 * Math.PI) / states.length;
  let radius = (states.length * minDistance) / (2 * Math.PI);

  let centre = pad + radius;

  let corner = 2 * centre;

  function getPosition(i: number) {
    let theta = angularSeparation * i;
    let unitP = [Math.cos(theta), Math.sin(theta)];

    let scaleP = unitP.map((e) => e * radius);
    let P = scaleP.map((e) => e + centre);
    return P;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={[0, 0, corner, corner].join(" ")}
    >
      <defs>
        <marker
          id="triangle"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#black" />
        </marker>
      </defs>
      {states.map((e, i) => {
        let [x, y] = getPosition(i);
        let node: FSM_Node = machine.nodes[e];
        let transfers = Object.keys(node.transfers);
        return (
          <g key={node.name}>
            {node.accepting ? (
              <Accepting x={x} y={y} name={node.name} />
            ) : (
              <Rejecting x={x} y={y} name={node.name} />
            )}
            {transfers.map((e) => {
              let to = node.transfers[e];
              let i = states.findIndex((e) => e === to);
              let [p, q] = getPosition(i);
              return (
                <Transition
                  fromX={x}
                  fromY={y}
                  label={e}
                  toX={p}
                  toY={q}
                  key={`${node.name}=>${to}`}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

export default StateCircle;
