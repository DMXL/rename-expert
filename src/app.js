import readline from "node:readline";
import chalk from "chalk";
import resolve from "./utils/resolve.js";
import { rename, scan } from "./utils/rename.js";

const run = (steps, cmd) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let answers = {};

  /**
   * Start app
   */
  const start = () => {
    // option -t, --test <filename>
    if (cmd.test) {
      steps = steps.slice(2);
    }
    // option -s, --src <src_dir>
    if (cmd.src) {
      scan(resolve(cmd.src), function (err) {
        err && console.log(err);
        done();
      });
    } else {
      prompt(steps.shift());
    }
  };

  /**
   * Parse current step and prompt question
   * @param step current step object
   */
  const prompt = (step) => {
    // check if to skip this step
    const skip = step.skip ? step.skip(cmd) : false;
    if (skip) {
      // try next
      next(step, skip);
    } else {
      let { question, defaultVal, addition } = step;
      question = chalk.green(question);

      // additional message
      addition && (question += chalk.gray(`(${addition}) `));

      // default value
      if (defaultVal) {
        // note value of `default` can be a method, initially
        if (typeof defaultVal === "function") {
          defaultVal = defaultVal(answers);
        }
        question += chalk.gray(`(default ${defaultVal}) `);
      }
      // rewrite step obeject and keep the original one
      const step_ = Object.assign({}, step);
      Object.assign(step, { question, defaultVal, step_ });

      rl.question(question, (answer) => {
        next(step, answer);
      });
    }
  };

  /**
   * Process answer and go to next step
   * @param _this parsed step object
   * @param answer
   */
  const next = (_this, answer) => {
    answer = answer.trim();
    // use default if nothing's entered
    if (answer === "" && _this.defaultVal) {
      answer = _this.defaultVal;
    }
    // process answer
    const { valid, result } = _this.process(answer);

    if (valid) {
      answers[_this.key] = result;
      // go next
      steps.length > 0 ? prompt(steps.shift()) : exec();
    } else {
      console.log(chalk.red(result || "something's wrong."));
      // to drop or to repeat
      _this.once ? done(true) : prompt(_this.step_);
    }
  };

  /**
   * App finishes
   * @param {boolean} drop if it finishes unexpected
   */
  const done = (drop) => {
    console.log(chalk.gray("answers are: " + JSON.stringify(answers)));
    console.log(chalk.blue(drop ? "dropped" : "finished."));
    rl.close();
  };

  /**
   * Execute rename
   */
  const exec = () => {
    const { test } = cmd;

    if (test) {
      const filename = test.trim();

      console.log(answers.regex, answers.pattern);
      console.log(
        chalk.blue("result: "),
        filename.replace(answers.regex, answers.pattern)
      );
      done();
    } else {
      rename(answers, function (err) {
        err && console.log(err);
        done();
      });
    }
  };

  start();
};

export default { run };
