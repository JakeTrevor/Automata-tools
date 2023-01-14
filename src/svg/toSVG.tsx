import { renderToString } from "react-dom/server";
import StateCircle from "./StateCircle.js";

function toSVG(machine: FSM) {
  return renderToString(<StateCircle machine={machine} />);
}

export default toSVG;
