import { Options } from "@rocu/cli";
import { RenderedStaticPage, Source } from "@rocu/page";
import { log } from "../logger";
import { render } from "../renderer";
import { getData } from "../structure";

export const generateStatic = async (source: Source, opts: Options): Promise<RenderedStaticPage[]> => {
  return render(source, opts);
};

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
