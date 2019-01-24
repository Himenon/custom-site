import { CommonOption } from "@custom-site/config";
import { RenderedStaticPage, Source } from "@custom-site/page";
import { getData } from "./getPage";
import { init } from "./lifeCycle";
import { notifyLog } from "./logger";
import { render } from "./renderer";
import { appStore } from "./store";

export const generateStatic = async (source: Source, options: CommonOption): Promise<RenderedStaticPage[]> => {
  return render(source, options);
};

export const generateStaticPages = async (dirname: string, options: CommonOption): Promise<RenderedStaticPage[] | undefined> => {
  init(options);
  const config = appStore.getState({ type: "config", id: "" }, options);
  const initialSource = await getData(config);
  try {
    const result = await generateStatic(initialSource, config);
    notifyLog("files saved to", dirname);
    return result;
  } catch (err) {
    notifyLog("error", err);
    process.exit(1);
  }
  return;
};
