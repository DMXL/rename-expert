/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-03-28 23:36:49
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-03-28 23:46:41
 */

const chalk = require('chalk')

exports.run = function(options, cmd) {
  console.log(chalk.green('Rename runs.'))

  if (cmd.input) {
    console.log(chalk.green('Input directory will be:'), cmd.input)
  }
}