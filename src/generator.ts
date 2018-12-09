import { Options } from "@rocu/cli";
import { RenderedStaticPage, Source } from "@rocu/page";
import { notifyLog } from "./logger";
import { render } from "./renderer";
import { getData } from "./structure/getPage";

export const generateStatic = async (source: Source, opts: Options): Promise<RenderedStaticPage[]> => {
  return render(source, opts);
};

export const generateStaticPage = async (dirname: string, options: Options): Promise<void> => {
  const initialSource = await getData(dirname, options);
  try {
    await generateStatic(initialSource, options);
    notifyLog("files saved to", dirname);
  } catch (err) {
    notifyLog("error", err);
    process.exit(1);
  }
};
