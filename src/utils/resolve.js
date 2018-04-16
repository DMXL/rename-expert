/*
 * COPYRIGHT © 2018 DMON STUDIO ALL RIGHTS RESERVED
 *
 * @Author: dm@dmon-studo.com
 * @Date: 2018-04-16 18:16:54
 * @Last Modified by: dm@dmon-studo.com
 * @Last Modified time: 2018-04-16 18:19:01
 */

const path = require('path')

module.exports = (dir) => {
  if (dir[0] === '~') {
    return path.join(process.env.HOME, dir.slice(1))
  }
  return path.resolve(__dirname, process.cwd(), dir)
}