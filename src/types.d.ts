type comment = {
  type: "comment";
};

type transfer = {
  type: "transfer";
  symbol: string;
  target: string;
};

type stateDef = {
  type: "stateDef";
  name: string;
  accepting: boolean;
};

type command = transfer | stateDef | comment;

type FSM_Node = {
  name: string;
  accepting: boolean;
  transfers: { [symbol: string]: string };
};

type FSM = {
  nodes: { [node_id: string]: FSM_Node };
  entry_point: string;
};
