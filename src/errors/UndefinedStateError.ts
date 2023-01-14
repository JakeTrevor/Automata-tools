import chalk from "chalk";
import alangError from "./AlangError.js";

export class UndefinedStateError extends alangError {
  constructor(line: number, lines: string[], filename: string) {
    super("Undefined State", line, lines, filename);
  }

  toString(): string {
    let state = this.lines[this.ln_number].split("=>")[1].trim();

    let fix = this.inject(`${state}:`, "\t<transition defs>");

    let message = [
      chalk.cyan.underline("Error: Undefined State Reference") +
        chalk.gray(` in line ${this.ln_number}`),
      "",
      `You have referenced a state ("${state}") which is not defined anywhere in your automata.`,
      "Fix this by adding a definition, like so:",
      fix,
      "If you want this to be accepting state, surround it with brackets " +
        chalk.cyan('"()"'),
    ].join("\n");

    return message;
  }
}

export default UndefinedStateError;
