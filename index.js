#!/usr/bin/env node

/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-03-28 14:10:48
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-03-30 16:10:55
 */

const cmd = require('commander')
const chalk = require('chalk')
const rename = require('./lib/rename')

process.title = 'dm-rename-expert'

cmd.version('0.1.0')
  .option('-i, --input [input_dir]', 'Set the directory of files that you want to rename')
  .parse(process.argv)

console.log(chalk.cyan('Here we go:'))
rename.run({}, cmd)
