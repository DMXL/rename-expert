#!/usr/bin/env node

/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-03-28 14:10:48
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-04-16 16:43:16
 */

const cmd = require('commander')
const chalk = require('chalk')
const app = require('./src/app')
const steps = require('./src/steps')

process.title = 'dm-rename-expert'

cmd.version('0.1.0')
  .command(chalk.blue('rename'))
  .option('-i, --input <input_dir>', 'set your directory of files to rename')
  .option('-t, --test \'<filename>\'', 'test your pattern with a dummy filename')
  .option('-s, --src <source_dir>', 'check your source directory')
  .parse(process.argv)

console.log(chalk.blue('Here we go:'))
app.run(steps, cmd.commands[0])
