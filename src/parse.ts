import UndefinedEntryPointError from "./errors/UndefinedEntryPointError.js";
import UndefinedStateError from "./errors/UndefinedStateError.js";

//the parser
const comment: comment = { type: "comment" };

export class FSM_Parser {
  lines: string[];
  filename: string;
  constructor(lines: string[], filename: string) {
    this.lines = lines;
    this.filename = filename;
  }

  getCommand(ln_number: number): command {
    let line = this.lines[ln_number].trim();

    if (/(?<!\\)=>/.test(line)) {
      let split = line.split(/(?<!\\)=>/);
      if (split.length != 2) {
        // TODO create custom error
        throw new Error();
      }
      let [symbol, target] = split;
      [symbol, target] = [
        symbol.trim().replace("\\=>", "=>"),
        target.trim().replace("\\=>", "=>"),
      ];

      return { type: "transfer", target, symbol };
    }

    if (line.includes(":")) {
      line = line.slice(0, -1).trim().replace("\\=>", "=>");

      let accepting = line.startsWith("(") || line.endsWith(")");
      if (accepting) {
        // TODO replace these errors
        if (!line.endsWith(")")) {
          throw new Error("Expected closing ')'");
        }
        if (!line.startsWith("(")) {
          throw new Error("Expected opening '('");
        }
        line = line.slice(1, -1).trim();
      }

      return { type: "stateDef", name: line, accepting };
    }

    return comment;
  }

  parse(): FSM {
    let lines = this.lines;

    let entry_point: string | undefined = undefined;
    let nodes: { [node_id: string]: FSM_Node } = {};
    let mostRecent: string | undefined = undefined;
    let states: { [state: string]: number | string } = {};

    for (let [i, line] of lines.entries()) {
      let command = this.getCommand(i);

      switch (command.type) {
        case "stateDef":
          nodes[command.name] = {
            name: command.name,
            accepting: command.accepting,
            transfers: {},
          };
          mostRecent = command.name;
          states[command.name] = "defined";
          break;

        case "transfer":
          if (mostRecent) {
            nodes[mostRecent].transfers[command.symbol] = command.target;
          } else {
            entry_point = command.target;
          }
          if (!states[command.target]) {
            states[command.target] = i;
          }
      }
    }

    if (!entry_point) {
      throw new UndefinedEntryPointError(this.lines, this.filename);
    }

    for (let lns of Object.values(states)) {
      if (typeof lns === "number") {
        throw new UndefinedStateError(lns, this.lines, this.filename);
      }
    }

    return {
      entry_point: entry_point,
      nodes: nodes,
    };
  }
}

export function traverse(fsm: FSM, text: string): FSM_Node {
  let state: FSM_Node = fsm.nodes[fsm.entry_point];

  for (let char of text) {
    let next = state.transfers[char];
    if (next) {
      state = fsm.nodes[next];
    }
  }
  return state;
}
