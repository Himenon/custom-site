import { Options } from "@rocu/cli";
import { generateStatic } from "../generator";
import { log } from "../logger";
import { getData } from "../server";

export const generateStaticPage = async (dirname: string, options: Options): Promise<void> => {
  const initialSource = await getData(dirname, options);
  generateStatic(initialSource, options)
    .then((result: any) => {
      log("files saved to", dirname);
    })
    .catch((err: any) => {
      log("error", err);
      process.exit(1);
    });
};
