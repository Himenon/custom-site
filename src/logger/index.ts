import chalk from "chalk";

export const log = (...messages: any[]) => {
  console.log(chalk.black.bgRedBright(" rocu "), chalk.redBright(...messages));
};
