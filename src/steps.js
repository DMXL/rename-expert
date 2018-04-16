/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-04-13 17:23:28
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-04-16 16:03:24
 */

const fs = require('fs')
const path = require('path')
const { parseInExp, parseOutExp } = require('./utils/parse')

// Steps
// 
// `key`:   key to store the entered value
// `defaultVal`:   default value
// `question`:   question text
// `skip`:  whether to skip this one (if yes, it's the preset value)
// `once`:  whether to repeat this one if check fails (false to repeat)
// `check`: method to validate the entered value
// `process`:  method to process the entered value before storing
module.exports = [
  // STEP 1
  {
    key: 'input',
    defaultVal: './',
    question: " ➡ input file directory: ",
    skip: ({ input }) => input,
    process: (entry) => {
      const inputDir = path.resolve(__dirname, process.cwd(), entry)
      const valid = fs.existsSync(inputDir)
      const result = valid ? inputDir : "input directory was not found."

      return { valid, result }
    }
  },
  // STEP 2
  {
    key: 'output',
    defaultVal: ({ input }) => input,
    question: " ➡ output file directory: ",
    process: (entry) => {
      const outputDir = path.resolve(__dirname, process.cwd(), entry)
      const valid = fs.existsSync(outputDir)
      const result = valid ? outputDir : "output directory was not found."

      return { valid, result }
    }
  },
  // STEP 3
  {
    key: 'before',
    question: " ➡ current naming pattern: ",
    addition: "try 'help'",
    process: (entry) => {
      if (entry === '') {
        return {
          valid: false,
          result: "enter something please.."
        }
      }
      return parseInExp(entry)
    }
  },
  // STEP 4
  {
    key: 'after',
    question: " ➡ output naming pattern: ",
    addition: "try 'help'",
    process: (entry) => {
      if (entry === '') {
        return {
          valid: false,
          result: "enter something please.."
        }
      }
      return parseOutExp(entry)
    }
  },
  // STEP 5
  {
    key: 'ext',
    question: " ➡ extension of the files: ",
    defaultVal: ".*",
    process: (entry) => {
      entry[0] === '.' && (entry = entry.slice(1))
      const valid = !/\./.test(entry)
      const result = valid ? entry : "extension name invalid."
      
      return { valid, result }
    }
  },
  // STEP 6
  {
    key: 'copy',
    defaultVal: 'n',
    question: " ➡ keep the original files? [Y/n] ",
    process: (entry) => {
      return { valid: true, result: entry === 'Y' }
    }
  }
]