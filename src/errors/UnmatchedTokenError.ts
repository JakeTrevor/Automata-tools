import chalk from "chalk";
import alangError from "./AlangError.js";

type token = "(" | ")";

export class UnmatchedTokenError extends alangError {
  token: token;
  constructor(line: number, lines: string[], filename: string, token: token) {
    super("Unmatched Token Error", line, lines, filename);
    this.token = token;
  }

  toString(): string {
    let state = this.lines[this.ln_number].split("=>")[1].trim();

    let fix = this.inject(`${state}:`, "\t<transition defs>");

    let message = [
      chalk.cyan.underline(`Error: unmatched "${this.token}"`) +
        chalk.gray(` in line ${this.ln_number}`),
      "",
      `You have referenced a state ("${state}") which is not defined anywhere in your automata.`,
      "Fix this by adding a definition, like so:",
      fix,
      "If this is not an accepting state, then remove the brackets entirely.",
    ].join("\n");

    return message;
  }
}

export default UnmatchedTokenError;
