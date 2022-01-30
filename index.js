#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import app from "./src/app.js";
import steps from "./src/steps.js";

process.title = "dm-rename-expert";

const cmd = new Command();

cmd
  .version("0.1.0")
  .command(chalk.blue("rename"))
  .option("-i, --input <input_dir>", "set your directory of files to rename")
  .option("-t, --test <filename>", "test your pattern with a dummy filename")
  .option("-s, --src <source_dir>", "check your source directory")
  .parse(process.argv);

console.log(chalk.blue("Here we go:"));
app.run(steps, cmd.commands[0]);
