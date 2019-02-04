// TODO import from '@custom-site'
import { AppModel } from "../../models";

export class QueryService {
  public static readonly ID = "";
  constructor(private readonly model: AppModel) {}

  public getConfig() {
    return this.model.get({ type: "config", id: QueryService.ID });
  }

  public getDestination(): string | undefined {
    const config = this.getConfig();
    return config ? config.destination : undefined;
  }

  public getCssFiles(): string[] {
    const config = this.getConfig();
    if (!config || !config.global.css) {
      return [];
    }
    const files = config.global.css.map(file => {
      if (typeof file === "string") {
        return file;
      }
      return file.href ? file.href : "";
    });
    return files.filter(file => file !== "");
  }

  public getJavaScriptFiles(): string[] {
    const config = this.getConfig();
    if (!config || !config.global.js) {
      return [];
    }
    const files = config.global.js.map(file => {
      if (typeof file === "string") {
        return file;
      }
      return file.src ? file.src : "";
    });
    return files.filter(file => file !== "");
  }

  public getPlugins() {
    return this.model.get({ type: "plugins", id: QueryService.ID }, []);
  }

  public getPluginPaths(): string[] {
    return this.model.get({ type: "pluginPaths", id: "" }, []);
  }

  public getCurrentMode(): "DEVELOPMENT" | "PRODUCTION" {
    const config = this.getConfig();
    if (config) {
      return config.__type || "DEVELOPMENT";
    }
    return "DEVELOPMENT";
  }

  public getLayoutFile(): string | undefined {
    const config = this.getConfig();
    if (!config || !config.layoutFile) {
      return;
    }
    return config.layoutFile;
  }

  public getCustomComponentsFile(): string | undefined {
    const config = this.getConfig();
    if (!config || !config.customComponentsFile) {
      return;
    }
    return config.customComponentsFile;
  }
}
