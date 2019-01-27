jest.unmock("../parser");
import { BuildOption, CommonOption, DevelopOption } from "@custom-site/config";
import * as path from "path";
import { parser } from "../parser";

describe("configのparserテスト", () => {
  const defaultCommonOption: CommonOption = {
    basePath: "/",
    blacklist: { extensions: [".mdx"] },
    configFile: "config.json",
    customComponentsFile: undefined,
    global: {},
    layoutFile: undefined,
    plugins: [],
    port: 8000,
    source: process.cwd(),
  };

  const defaultBuildOption: BuildOption = {
    ...defaultCommonOption,
    destination: "",
    __type: "PRODUCTION",
  };

  const defaultDevelopOption: DevelopOption = {
    ...defaultCommonOption,
    open: true,
    __type: "DEVELOPMENT",
  };

  test("default build config parameters", () => {
    expect(() => {
      parser(undefined, true, {});
    }).toThrowError();
    expect(parser({ ...defaultCommonOption, destination: "/test" }, true, {})).toEqual({ ...defaultBuildOption, destination: "/test" });
  });

  test("default development config parameters", () => {
    const result = parser(undefined, false, {});
    expect(result).toEqual(defaultDevelopOption);
  });

  test("config.jsonにあるconfigFileは無視する", () => {
    const result0 = parser({ ...defaultCommonOption, configFile: "my.config.json" }, false, {});
    expect(result0.configFile).toBe("config.json");
  });

  test("cliの引数のconfigファイルまでのパスが最優先", () => {
    const result1 = parser({ ...defaultCommonOption, configFile: "my.config.json" }, false, { config: "cli.config.json" });
    expect(result1.configFile).toBe("cli.config.json");
  });

  test("output directory", () => {
    const result0 = parser({ ...defaultCommonOption }, true, { outDir: "./test1" });
    expect(result0.destination).toBe(path.join(process.cwd(), "./test1"));
    const result1 = parser({ ...defaultCommonOption }, true, { outDir: "/test1" });
    expect(result1.destination).toBe(path.join(process.cwd(), "/test1"));
  });

  test("basePath", () => {
    const result0 = parser({ ...defaultCommonOption, basePath: "/a/" }, false, {});
    expect(result0.basePath).toBe("/a/");
    const result1 = parser(undefined, false, { basePath: "/b/" });
    expect(result1.basePath).toBe("/b/");
    const result2 = parser(undefined, false, { basePath: "b/" });
    expect(result2.basePath).toBe("/b/");
    const result3 = parser({ ...defaultCommonOption, basePath: "/a/" }, false, { basePath: "/b/" });
    expect(result3.basePath).toBe("/a/");
  });

  test("port number", () => {
    // 1st priority: cli arguments
    const result2 = parser(defaultCommonOption, false, { port: "10001" });
    expect(result2.port).toBe(10001);

    const result1 = parser(undefined, false, { port: "10000" });
    expect(result1.port).toBe(10000);

    // 2nd priority: config file
    const result0 = parser({ ...defaultCommonOption, port: 9999 }, false, {});
    expect(result0.port).toBe(9999);
  });
});
