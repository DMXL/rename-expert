/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-03-28 23:36:49
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-03-30 16:10:14
 */

const fs = require('fs')
const readline = require('readline')
const chalk = require('chalk')
const parser = require('./parse')

exports.run = (options, cmd) => {
  let steps = [],
      answers = new Map()

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const prompt = (step) => {
    // do not skip if command option returns `true`
    // this happens when no command option is provided
    if (step.skip && typeof step.skip !== 'boolean') {
      // try next
      next(step, step.skip)
    } else {
      let question = step.qus
      if (step.def) {
        // note that `def` can be a method, initially
        if (typeof step.def === 'function') {
          step.def = step.def()
        }
        question += `(default ${step.def}) `
      }
      rl.question(chalk.green(question), ans => {
        next(step, ans)
      })
    }
  }

  const next = (_this, ans) => {
    // use default if nothing's entered
    if (ans.trim() === '' && _this.def) {
      ans = _this.def
    }
    const result = _this.check(ans.trim())
    // check() may just return Boolean, `true` most probably
    if (result === true || result.valid) {
      // store answer
      if (_this.proc && typeof _this.proc === 'function') {
        ans = _this.proc(ans)
      }
      answers.set(_this.key, ans)
      // go next
      if (steps.length > 0) {
        prompt(steps.shift())
      } else {
        // user input finishes, run main task
        done() // TODO: exec()
      }
    } else if (!_this.once) {
      console.log(chalk.red(result.msg || 'something\'s wrong.'))
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

  const exec = () => {
    
  }

  const drop = (msg) => {
    console.log(chalk.red(msg))
    console.log(chalk.green('dropped.'))
    rl.close()
  }

  const init = () => {
    // Initialize steps
    //
    // `key`: key to store the entered value
    // `def`: default value
    // `qus`: question text
    // `skip`: whether to skip this one (if yes, it's the preset value)
    // `once`: whether to repeat this one if check fails (false to repeat)
    // `check`: method to validate the entered value
    // `proc`: method to process the entered value before storing
    steps.push(
      // STEP 1
      {
        key: 'input',
        def: './',
        qus: " ➡ input file directory: ",
        skip: cmd.input || false,
        check: (entry) => {
          const valid = fs.existsSync(entry),
            msg = valid ? "" : "input directory was not found."
          return { valid, msg }
        }
      },
      // STEP 2
      {
        key: 'output',
        def: () => answers.get('input'),
        qus: " ➡ output file directory: ",
        check: (entry) => {
          const valid = fs.existsSync(entry),
            msg = valid ? "" : "output directory was not found."
          return { valid, msg }
        }
      },
      // STEP 3
      {
        key: 'before',
        qus: " ➡ current naming pattern: (try 'help') ",
        check: (entry) => {
          const valid = !(entry.trim() === ''),
            msg = valid ? "" : "enter something please.."
          return { valid, msg }
        },
        proc: (entry) => {
          return parser.parseInExp(entry)
        }
      },
      // STEP 4
      {
        key: 'after',
        qus: " ➡ output naming pattern: (try 'help') ",
        check: (entry) => {
          const valid = !(entry.trim() === ''),
            msg = valid ? "" : "enter something please.."
          return { valid, msg }
        },
        proc: (entry) => {
          return parser.parseOutExp(entry)
        }
      },
    )
  }

  const start = () => {
    init()
    prompt(steps.shift())
  }

  start()
}