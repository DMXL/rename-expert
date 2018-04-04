/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-03-29 15:46:53
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-04-04 14:12:14
*/

const chalk = require('chalk')

const tagReg = /%[^%\s]+%/g
const funcReg = /\$(NU|CA|UP|LO)\([^()]*\)/g

let tags = new Set()

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

  if (matches) {
    matches.forEach((match) => {
      // remove the `%`
      let tag = match.substr(1, match.length - 2)
      tags.add(tag)
    })
    
    return exp.replace(tagReg, '(.*)')
  }
  console.log(chalk.yellow('warning: no tags were found in that expression'))
  return false
}

/**
 * Parse output filename pattern
 * @param exp user defined expression
 */
exports.parseOutExp = (exp) => {
  const matches = exp.match(funcReg)

  if (matches) {
    console.log(matches.join(' '))
    return false
    // return matches.join(' ')
  }
  console.log(chalk.yellow('warning: no tags were found in that expression'))
  return false //TODO:
}