import { CommonOption } from "@custom-site/config";
import { RenderedStaticPage, Source } from "@custom-site/page";
import { getData } from "./getPage";
import { init } from "./lifeCycle";
import { notifyLog } from "./logger";
import { render } from "./renderer";

export const generateStatic = async (source: Source, options: CommonOption): Promise<RenderedStaticPage[]> => {
  return render(source, options);
};

export const generateStaticPages = async (dirname: string, options: CommonOption): Promise<RenderedStaticPage[] | undefined> => {
  init(options);
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
