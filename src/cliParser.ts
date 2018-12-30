import { Options } from "@rocu/cli";
import * as dot from "dot-prop";
import * as meow from "meow";
import * as path from "path";
import * as readPkgUp from "read-pkg-up";

export const parser = (cli: meow.Result): Options => {
  const [currentDirectory = process.cwd()] = cli.input;
  /**
   * package.jsonの"rocu"に記述されたパラメータを読み取る
   */
  const pkg = readPkgUp.sync({ cwd: currentDirectory }) || {};
  console.log(cli.flags);
  return {
    ...dot.get(pkg, "pkg.rocu"),
    ...cli.flags,
    sourceDirectory: currentDirectory,
    outDir: cli.flags.outDir ? path.join(process.cwd(), cli.flags.outDir) : undefined,
  };
};
