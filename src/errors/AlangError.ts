import boxen from "boxen";
import chalk from "chalk";

type ErrorType = "Expected (" | "Expected )";

export class alangError extends Error {
  ln_number: number;
  lines: string[];
  filename: string;
  injectBefore = false;

  constructor(
    message: string,
    ln_number: number,
    lines: string[],
    filename: string
  ) {
    super(message);
    this.name = "alangError";
    this.ln_number = ln_number;
    this.lines = lines;
    this.filename = filename;
  }

  toString(): string {
    return chalk.cyan.underline(
      "Error: Unspecified Parsing error on line: " + this.ln_number
    );
  }

  addLineNumbers(start: number, lines: string[]) {
    let end = lines.length + start;
    let size = end.toString().length;
    return lines.map(
      (line, ln_num) => `${start + ln_num}`.padStart(size, " ") + " | " + line
    );
  }

  findNextStateDef(fromLine: number): number {
    let lines = this.lines.slice(fromLine);
    let currentLine = lines[0];
    let pos = 0;
    while (!currentLine.includes(":") && pos < lines.length) {
      currentLine = lines[pos];
      pos++;
    }
    return fromLine + pos;
  }

  example(code: string[]): string {
    return boxen(code.join("\n").replace("\t", "   "), {
      padding: 1,
      borderStyle: "round",
      margin: 1,
      title: this.filename,
      titleAlignment: "left",
    });
  }

  inject(...newLines: string[]) {
    let lines = this.lines;
    let target = this.findNextStateDef(this.ln_number);

    if (this.injectBefore) target -= 1;

    while (isComment(lines[target])) {
      target -= 1;
    }

    if (isWhitespace(lines[target])) {
      target -= 1;
    } else {
      newLines = newLines.concat("");
    }

    target = target < 0 ? 0 : target;

    if (target != 0 && !isWhitespace(lines[target - 1])) {
      newLines.unshift("");
    }

    let from = target - 2;
    from = from < 0 ? 0 : from;

    let to = target + 2;
    to = to > lines.length ? lines.length : to;

    let maxSize = to.toString.length;

    let code = this.lines.slice(from, to);
    code = this.addLineNumbers(from, code);

    let insertionPoint = target - from;

    let newlines = newLines.map((e) =>
      chalk.green("+".padStart(maxSize, " ") + " | " + e)
    );

    code.splice(insertionPoint, 0, ...newlines);

    return this.example(code);
  }
}

function isWhitespace(line: string) {
  return !/\S/.test(line);
}

function isComment(line: string): boolean {
  if (isWhitespace(line)) return false;
  let isNotComment = /.*((=>)|\(\)|:|\[.*\]).*/.test(line);
  return !isNotComment;
}

export default alangError;
