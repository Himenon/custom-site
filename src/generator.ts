import { BuildOption } from "@rocu/cli";
import { RenderedStaticPage, Source } from "@rocu/page";
import { notifyLog } from "./logger";
import { render } from "./renderer";
import { getData } from "./repository/getPage";

export const generateStatic = async (source: Source): Promise<RenderedStaticPage[]> => {
  return render(source);
};

export const generateStaticPages = async (dirname: string, options: BuildOption): Promise<RenderedStaticPage[] | undefined> => {
  const initialSource = await getData(dirname, options);
  try {
    const result = await generateStatic(initialSource);
    notifyLog("files saved to", dirname);
    return result;
  } catch (err) {
    notifyLog("error", err);
    process.exit(1);
  }
  return;
};
