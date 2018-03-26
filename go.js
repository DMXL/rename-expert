/*
 * Copyright 2018 DMON STUDIO All rights reserved.
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-03-26 18:58:23
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-03-26 19:16:51
 */

const cmd = require('commander')
const chalk = require('chalk')

cmd.version('1.0.0')
  .option('-p, --pattern [text]', 'Match pattern [marble]', 'marble')
  .parse(process.argv)

console.log(chalk.blue('You are matching:'))
if (cmd.pattern) {
  console.log(chalk.green(`${cmd.pattern} as the pattern`))
}
