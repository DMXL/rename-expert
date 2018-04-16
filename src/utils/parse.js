/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-03-29 15:46:53
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-04-16 15:25:10
*/

const chalk = require('chalk')

const tagReg = /%[^%\s]+%/g
// const funcReg = /\$(NU|CA|UP|LO)\([^()]*\)/g

let tags = []

/**
 * Parse input filename pattern
 * @param exp user defined expression
 * 
 * match all the `%TAG_NAME%`s
 * return with the regex string for rename task's input
 * or `false` if matching fails
 */
exports.parseInExp = (exp) => {
  const matches = exp.match(tagReg)
  const valid = !!matches
  let result = ''

  if (valid) {
    matches.forEach((match, i) => {
      // remove the `%`
      const tag = match.substr(1, match.length - 2)
      tags.push(tag)
    })
    // note: need to avoid greedy matching
    result = exp.replace(tagReg, '(.*)').replace(/\(\.\*\)/, '(.*?)')
  } else {
    result = chalk.yellow('warning: no tags were found in that expression')
  }

  return { valid, result }
}

/**
 * Parse output filename pattern
 * @param exp user defined expression
 */
exports.parseOutExp = (exp) => {
  const result = exp.replace(tagReg, (match) => {
    // remove the `%`
    const tag = match.substr(1, match.length - 2)
    // return the according `$n` if tag is found
    const index = tags.indexOf(tag)
    return index < 0 ? match : `$${index + 1}`
  })

  return { valid: true, result }
}