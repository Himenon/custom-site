import chalk from "chalk";

export const notifyLog = (...messages: any[]) => {
  console.log(chalk.black.bgRedBright(" rocu "), chalk.redBright(...messages));
};

const debug = console.log.bind(console);

export const debugLog = (...messages: any[]) => {
  debug(...messages);
};
