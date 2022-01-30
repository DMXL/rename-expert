import path from "node:path";

const resolve = (dir) => {
  if (dir[0] === "~") {
    return path.join(process.env.HOME, dir.slice(1));
  }
  return path.resolve(__dirname, process.cwd(), dir);
};

export default resolve;
