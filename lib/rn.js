/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-03-28 23:36:49
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-03-29 15:03:36
 */

const fs = require('fs')
const readline = require('readline')
const chalk = require('chalk')

exports.run = function(options, cmd) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  let steps = [], 
      answers = new Map()

  const prompt = (step) => {
    if (step.skip) {
      // try next
      next(step, step.skip)
    } else {
      rl.question(chalk.green(step.qus), ans => {
        next(step, ans)
      })
    }
  }

  const next = (_this, ans) => {
    if (_this.check(ans)) {
      // store answer
      answers.set(_this.key, ans)
      // go next
      if (steps.length > 0) {
        prompt(steps.shift())
      } else {
        done()
      }
    } else if (!_this.once) {
      console.log(chalk.red(_this.err))
      // clear skip flag
      _this.skip = false
      // repeat question
      prompt(_this)
    } else {
      drop()
    }
  }

  const done = () => {
    console.log(chalk.gray('answers are: ', ...answers.entries()))
    console.log(chalk.green('done.'))
    rl.close()
  }

  const drop = (msg) => {
    console.log(chalk.red(msg))
    console.log(chalk.green('dropped.'))
    rl.close()
  }

  const start = () => {
    prompt(steps.shift())
  }

  // initialize steps
  steps.push(
    // STEP 1
    {
      key: 'input',
      qus: " ➡ input file directory: ",
      skip: cmd.input || false,
      check (entry) {
        return fs.existsSync(entry)
      },
      err: "input directory was not found."
    },
    // STEP 2
    {
      key: 'pattern',
      qus: " ➡ current naming pattern: ",
      check (entry) {
        return true
      },
      err: "the pattern was somewhat unrecognized."
    }
  )

  start()
}