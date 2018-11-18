import chalk from "chalk";

export const log = (...messages: any[]) => {
  console.log(chalk.black.bgCyan(" rocu "), chalk.cyan(...messages));
};
