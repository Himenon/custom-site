import { Options } from "@rocu/cli";
import { RenderedStaticPage, Source } from "@rocu/page";
import { notifyLog } from "./logger";
import { render } from "./renderer";
import { getData } from "./repository/getPage";

export const generateStatic = async (source: Source, opts: Options): Promise<RenderedStaticPage[]> => {
  return render(source, opts);
};

export const generateStaticPages = async (dirname: string, options: Options): Promise<RenderedStaticPage[] | undefined> => {
  const initialSource = await getData(dirname, options);
  try {
    const result = await generateStatic(initialSource, options);
    notifyLog("files saved to", dirname);
    return result;
  } catch (err) {
    notifyLog("error", err);
    process.exit(1);
  }
  return;
};
