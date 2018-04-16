/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-03-28 23:36:49
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-04-16 15:55:20
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const chalk = require('chalk')
const { parseInExp, parseOutExp } = require('./utils/parse')
const { rename } = require('./utils/rename')

exports.run = (steps, cmd) => {  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  let answers = {}

  const start = () => {
    // option -t, --test <filename>
    if (cmd.test) {
      steps = steps.slice(2)
    }

    // option -s, --src <src_dir>
    if (cmd.src) {
      rename({
        src: cmd.src
      }, function (err) {
        err && console.log(err)
        done()
      })
    } else {
      prompt(steps.shift())
    }
  }

  const prompt = (step) => {
    // check if to skip this step
    const skip = step.skip ? step.skip(cmd) : false
    if (skip) {
      // try next
      next(step, skip)
    } else {
      let { question, defaultVal, addition } = step
      question = chalk.green(question)

      // additional message
      addition && (question += chalk.white(`(${addition}) `))

      // default value
      if (defaultVal) {
        // note value of `default` can be a method, initially
        if (typeof defaultVal === 'function') {
          defaultVal = defaultVal(answers)
        }
        question += chalk.white(`(default ${defaultVal}) `)
      }
      // rewrite step obeject and keep the original one
      const step_ = Object.assign({}, step)
      Object.assign(step, { question, defaultVal, step_ })

      rl.question(question, answer => {
        next(step, answer)
      })
    }
  }

  const next = (_this, answer) => {
    answer = answer.trim()
    // use default if nothing's entered
    if (answer === '' && _this.defaultVal) {
      answer = _this.defaultVal
    }
    // process answer
    const { valid, result } = _this.process(answer)

    if (valid) {
      answers[_this.key] = result
      // go next
      steps.length > 0 ? prompt(steps.shift()) : exec()
    } else if (!_this.once) {
      console.log(chalk.red(result || 'something\'s wrong.'))
      // to drop or to repeat
      _this.once ? done(true) : prompt(_this.step_)
    }
  }

  const done = (drop) => {
    console.log(chalk.white('answers are: ' + JSON.stringify(answers)))
    console.log(chalk.cyan(drop ? 'dropped' : 'finished.'))
    rl.close()
  }

  const exec = () => {
    const { test } = cmd
    const { input, output, before, after, copy } = answers
    const regex = new RegExp(before)
    
    if (test) {
      const filename = test.trim()
      const reg = new RegExp(before)
      
      console.log(before, after)
      console.log(chalk.cyan('result: '), filename.replace(reg, after))
    } else {
      rename({
        src: input,
        dest: output,
        regex,
        pattern: after,
        copy
      }, function(err) {
        err && console.log(err)
        done()
      })
    }
  }

  start()
}