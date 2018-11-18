import { Options } from "@rocu/cli";
import { RenderedPage, Source } from "@rocu/page";
import { render } from "../renderer";

export const generateStatic = async (source: Source, opts: Options): Promise<RenderedPage[]> => {
  return render(source, opts);
};
