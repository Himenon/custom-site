// import * as fs from "fs";
// import * as vm from "vm";
import { getPluginPath } from "./index";

export const loadExternalFunction = <T>(filename: string): T | undefined => {
  /**
   * https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options
   */
  // const sandbox: vm.Context = vm.createContext({
  //   exports,
  //   require,
  // });

  // const data = fs.readFileSync(filename, { encoding: "utf-8" });

  if (typeof filename !== "string") {
    return;
  }
  const pluginPath = getPluginPath(filename, process.cwd());
  if (!pluginPath) {
    return;
  }
  try {
    return require(pluginPath);
    // const script = new vm.Script(data, { displayErrors: true });
    // script.runInNewContext(sandbox, { displayErrors: true });
  } catch (e) {
    console.error(`"${filename}" include below error.`);
    console.error(e);
  }
  return;
  // return sandbox.exports;
};
