import { HtmlMetaData } from "@custom-site/interfaces/lib/page";
import { State as PluginState } from "@custom-site/interfaces/lib/plugin";
import { PluginModel } from "../../models";

export class QueryService {
  public static readonly ID = "";
  constructor(private readonly model: PluginModel) {}

  public savePlugin<T extends keyof PluginState>(params: { type: T; id: string; state: PluginState[T] }) {
    this.model.set(params);
  }

  public getGenerateMetaData(id: string): HtmlMetaData {
    const result = this.model.get({ type: "GENERATE_META_DATA", id });
    return result ? result.page.metaData : {};
  }

  public getAfterRenderPage(id: string): string {
    const result = this.model.get({ type: "AFTER_RENDER_PAGE", id });
    return result ? result.html : "";
  }
}
