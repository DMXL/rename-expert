import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

const replace = (filename, regex, pattern) => {
  return filename.replace(regex, pattern);
};

const rename = ({ src, dest, regex, pattern, ext, copy }, callback) => {
  // scan source directory
  fs.readdir(src, (err, files) => {
    // empty directory
    if (files.length === 0) {
      callback(chalk.yellow("source directory is empty."));
      return;
    }

    const targets = files.filter((file) => {
      const extname = path.extname(file);
      const fullname = path.basename(file);
      const name = path.basename(file, extname);

      if (ext === ".*" || ext === extname) {
        const newName = name.replace(regex, pattern);
        const newFullname = `${newName}${ext}`;

        if (!copy) {
          console.log("moving: " + fullname);
          fs.renameSync(path.join(src, fullname), path.join(dest, newFullname));
        } else {
          console.log("copying: " + fullname);
          fs.copyFileSync(
            path.join(src, fullname),
            path.join(dest, newFullname)
          );
        }
        return true;
      }
      return false;
    });
    // no file with targeted extension name found
    if (targets.length === 0) {
      callback(chalk.yellow(`did not find any ${ext} file.`));
      return;
    }

    callback();
  });
};

const scan = (src, callback) => {
  fs.readdir(src, (err, files) => {
    if (files.length === 0) {
      callback(chalk.yellow("source directory is empty."));
      return;
    }
    files.forEach((file) => {
      console.log(file);
    });
    callback();
  });
};

export { replace, rename, scan };
