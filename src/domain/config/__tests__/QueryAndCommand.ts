import { CommonOption } from "@custom-site/config";
import { State as AppState } from "@custom-site/internal";
import { Model } from "../../../models";
import { CommandService as AppCommandService } from "../command";
import { QueryService as AppQueryService } from "../query";

describe("QueryService Test", () => {
  let appModel: Model<AppState>;
  let appQueryService: AppQueryService;
  let commandService: AppCommandService;
  const defaultConfig: CommonOption = {
    source: "source_test",
    global: {},
    baseUri: "/baseUri",
    baseUrl: "http://base.url",
    port: 8000,
    blacklist: { extensions: [] },
    plugins: [],
  };
  beforeAll(() => {
    appModel = new Model<AppState>();
    appQueryService = new AppQueryService(appModel);
    commandService = new AppCommandService(appModel);
    commandService.saveConfig(defaultConfig);
  });

  it("getConfig", () => {
    expect(appQueryService.getConfig()).toBe(defaultConfig);
  });

  it("getCssFiles", () => {
    expect(appQueryService.getCssFiles().length).toBe(0);
  });

  it("getJavaScriptFiles", () => {
    expect(appQueryService.getJavaScriptFiles().length).toBe(0);
  });

  it("getPlugins", () => {
    expect(appQueryService.getPlugins().length).toBe(0);
  });

  it("getPluginPaths", () => {
    expect(appQueryService.getPluginPaths().length).toBe(0);
  });

  it("getCurrentMode", () => {
    expect(appQueryService.getCurrentMode()).toBe("DEVELOPMENT");
  });

  it("getLayoutFile", () => {
    expect(appQueryService.getLayoutFile()).toBeUndefined();
  });

  it("getCustomComponentsFile", () => {
    expect(appQueryService.getCustomComponentsFile()).toBeUndefined();
  });

  it("getLibraryOutputPath", () => {
    expect(appQueryService.getLibraryOutputPath()).toBe("lib");
  });
});
