const chalk = require("chalk");

const tagReg = /%[^%\s]+%/g; // default tag: %TAG_NAME%
const numReg = /%[^%\s]+\.NUM%/g; // number tag: %TAG_NAME.NUM%

// const funcReg = /\$(NU|CA|UP|LO)\([^()]*\)/g

let tags = [];

/**
 * Parse input filename pattern
 * @param exp user defined expression
 *
 * match all the `%TAG_NAME%`s
 */
exports.parseInExp = (exp) => {
  const matches = exp.match(tagReg);
  const valid = !!matches;
  let result = "";
  let hasNum = false;

  if (valid) {
    matches.forEach((match, i) => {
      // remove the `%` tag wrappers after checking tag type
      const tag = numReg.test(match)
        ? match.substr(1, match.length - 6)
        : match.substr(1, match.length - 2);
      tags.push(tag);
    });

    // NOTE: need to avoid greedy matching for all but the last token
    let temp = exp
      .replace(numReg, "(\\d+?)")
      .replace(tagReg, "(.*?)")
      .replace(/\((.*)\?\)(?!.*\(.*\?\))/, "($1)");

    result = new RegExp(temp);
  } else {
    result = chalk.yellow("warning: no tags were found in that expression");
  }

  return { valid, result };
};

/**
 * Parse output filename pattern
 * @param exp user defined expression
 */
exports.parseOutExp = (exp) => {
  const result = exp.replace(tagReg, (match) => {
    // remove the `%`
    const tag = match.substr(1, match.length - 2);
    // return the according `$n` if tag is found
    const index = tags.indexOf(tag);
    return index < 0 ? match : `$${index + 1}`;
  });

  return { valid: true, result };
};
