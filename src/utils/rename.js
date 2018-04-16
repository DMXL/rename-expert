/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-04-04 14:37:34
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-04-14 02:15:51
 */

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const resolve = (dir) => {
  return path.resolve(__dirname, process.cwd(), dir)
}

exports.rename = ({ src, dest, regex, pattern, copy }, callback) => {

  fs.readdir(resolve(src), (err, files) => {
    if (files.length === 0) {
      callback(chalk.yellow('input directory is empty.'))
    }
    
    files.forEach(function (file) {
      console.log(file)
    })

    callback()
  })
}