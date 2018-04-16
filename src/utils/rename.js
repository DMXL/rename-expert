/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-04-04 14:37:34
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-04-16 19:04:59
 */

const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

exports.rename = ({ src, dest, regex, pattern, ext, copy }, callback) => {
  
  // scan source directory
  fs.readdir(src, (err, files) => {
    
    // empty directory
    if (files.length === 0) {
      callback(chalk.yellow('source directory is empty.'))
      return
    }

    const targets = files.filter((file) => {
      if (ext === '.*' || ext === path.extname(file)) {
        console.log(file)
        return true
      }
      return false
    })
    // no file with targeted extension name found
    if (targets.length === 0) {
      callback(chalk.yellow(`did not find any ${ext} file.`))
      return
    }

    callback()
  })
}

exports.scan = (src, callback) => {
  fs.readdir(src, (err, files) => {
    if (files.length === 0) {
      callback(chalk.yellow('source directory is empty.'))
      return
    }
    files.forEach((file) => {
      console.log(file)
    })
    callback()
  })
}