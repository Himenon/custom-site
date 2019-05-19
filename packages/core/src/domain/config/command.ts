// TODO import from '@custom-site'
import { CommonOption } from "@custom-site/interfaces";
import { Plugin } from "@custom-site/interfaces/lib/plugin";
import { AppModel } from "../../models";

export class CommandService {
  public static readonly ID = "";
  constructor(private readonly model: AppModel) {}

  public saveConfig(state: CommonOption) {
    this.model.set({
      type: "config",
      id: "",
      state,
    });
  }

  public savePlugins(plugins: Plugin[]) {
    this.model.set({
      type: "plugins",
      id: "",
      state: plugins,
    });
  }

  public savePluginPaths(pluginPaths: string[]) {
    this.model.set({ type: "pluginPaths", id: "", state: pluginPaths });
  }
}
