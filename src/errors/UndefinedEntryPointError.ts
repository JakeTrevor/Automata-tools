import chalk from "chalk";
import alangError from "./AlangError.js";

export class UndefinedEntryPointError extends alangError {
  injectBefore: boolean = true;

  constructor(lines: string[], filename: string) {
    super("Undefined Entry Point", 0, lines, filename);
  }

  toString(): string {
    let fix = this.inject("=> <StartingState>");

    let message = [
      chalk.cyan.underline("Error: Undefined Entry Point") +
        chalk.gray(` in line ${this.ln_number}`),
      "",
      "Your FSM does not define its starting state (entry point).",
      "Fix this by adding a definition, like so:",
      fix,
      chalk.blue.underline(
        "Note: The entry point definition must be " +
          chalk.italic("before") +
          " any state definitions."
      ),
    ].join("\n");

    return message;
  }
}

export default UndefinedEntryPointError;
