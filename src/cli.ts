#!/usr/bin/env node
import fs from "fs";
import path from "path";

import { program } from "commander";
import chalk from "chalk";

import { FSM_Parser, traverse } from "./parse.js";
import boxen from "boxen";
import toSVG from "./svg/toSVG.js";

program
  .name("Alang")
  .description("Automata language compiler and interpreter")
  .version("0.0.1");

program
  .command("compile")
  .summary("Compile an automata from a given file")
  .description(
    "Compile an automata from a given file.\nResulting JSON is printed to stdout - and therefore can be piped into a file."
  )
  .argument("<file>", "file to be compiled")
  .action((file: string) => {
    let data = readFile(file);

    let machine = parse(data, file);

    console.log(JSON.stringify(machine));
  });

program
  .command("svg")
  .summary("Create an SVG for an automata")
  .description(
    "An automata will be read in and compiled to an object.\nIt is then rendered into an SVG, which is printed to stdout"
  )
  .argument("<file>", "file to be compiled")
  .action((file: string) => {
    let data = readFile(file);

    let machine = parse(data, file);

    let image = toSVG(machine);

    console.log(image);
  });

program
  .command("check")
  .summary("Validate an automata from a given file")
  .description(
    "Check if an automata is valid (will compile). Automata is loaded from a file."
  )
  .argument("<file>", "file to be compiled")
  .action((file: string) => {
    let data = readFile(file);

    parse(data, file);

    console.log(chalk.green("✓ | Machine is valid"));
  });

program
  .command("run")
  .summary("Run an automata")
  .description(
    "Run a string through the provided automata; prints the result (the string, the final state, and weather the machine accepts or rejects"
  )
  .argument("<file>", "automata file to run")
  .argument("<strings...>")
  .option("-m, --multi", "allow multiple arguments", false)
  .action((file: string, strings: string[], { multi }) => {
    if (!multi) {
      strings = [strings.join(" ")];
    }

    let data = readFile(file);

    let machine = parse(data, file);

    let results = strings.map((string) => {
      let state = traverse(machine, string);
      if (state.accepting) {
        let arr = [string, "✓", `accepts with state "${state.name}"`];
        return arr.map((e) => chalk.green(e));
      } else {
        let arr = [string, "×", `rejects with state "${state.name}"`];
        return arr.map((e) => chalk.red(e));
      }
    });
    let pad = Math.max(...results.map((e) => e[0].length));
    results = results.map((e) => {
      e[0] = e[0].padEnd(pad, " ");
      return e;
    });
    let text = results.flatMap((e) => e.join(" │ ")).join("\n");
    console.log(
      boxen(text, {
        borderStyle: "round",
        padding: 0.5,
      })
    );
  });

program.parse();

function readFile(file: string): string {
  if (!fs.existsSync(file)) {
    console.log(chalk.red(`Error: File Provided (${file}) does not exist`));
    process.exit(1);
  }

  return fs.readFileSync(file).toString();
}

function parse(data: string, file: string): FSM {
  let type = path.extname(file);
  let fname = path.basename(file, type);
  try {
    return new FSM_Parser(data.split("\r\n"), fname).parse();
  } catch (error: any) {
    console.log(error.toString());
    process.exit(1);
  }
}
