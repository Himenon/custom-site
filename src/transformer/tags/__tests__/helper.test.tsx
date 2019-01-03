jest.unmock("../helpers");
import { CommonOption } from "@custom-site/cli";
import { PageElement } from "@custom-site/page";

import { rewriteUrl } from "../helpers";

describe("Link Element", () => {
  const currentUri = (uri: string): PageElement => ({
    uri,
    content: "",
    metaData: {},
    filename: "",
    name: "",
    raw: "",
    ext: "",
  });
  const basePath = (serverBasePath: string): CommonOption => ({
    source: "",
    global: {},
    serverBasePath,
    blacklist: {
      extensions: [],
    },
  });

  test("http,https", () => {
    expect(rewriteUrl("http://a", currentUri("/a/b/c"), basePath("/"))).toBe("http://a");
    expect(rewriteUrl("https://a", currentUri("/a/b/c/d"), basePath("/"))).toBe("https://a");
  });

  test("normal", () => {
    expect(rewriteUrl("/a/b/c", currentUri("/a/b/c"), basePath("/"))).toBe("/a/b/c");
    expect(rewriteUrl("/a/b/c", currentUri("/a/b/c/d"), basePath("/"))).toBe("/a/b/c");
  });

  test("add base path", () => {
    expect(rewriteUrl("/a/b/c", currentUri("/test/a/b/c"), basePath("/test"))).toBe("/test/a/b/c");
    expect(rewriteUrl("/a/b/c", currentUri("/test/a/b/c/d"), basePath("/test"))).toBe("/test/a/b/c");
  });

  test("./", () => {
    expect(rewriteUrl("./target-file", currentUri("/"), basePath("/"))).toBe("/target-file");
    expect(rewriteUrl("./target-file", currentUri("/a/b/c"), basePath("/"))).toBe("/a/b/target-file");
    expect(rewriteUrl("./target-file", currentUri("/a/b/c/"), basePath("/"))).toBe("/a/b/target-file");

    expect(rewriteUrl("./target-file", currentUri("/"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteUrl("./target-file", currentUri("/a/b/c"), basePath("/test"))).toBe("/test/a/b/target-file");
    expect(rewriteUrl("./target-file", currentUri("/a/b/c/"), basePath("/test"))).toBe("/test/a/b/target-file");

    expect(rewriteUrl("./target-file", currentUri("/test"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteUrl("./target-file", currentUri("/test/"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteUrl("./target-file", currentUri("/test/a/b/c"), basePath("/test"))).toBe("/test/a/b/target-file");
    expect(rewriteUrl("./target-file", currentUri("/test/a/b/c/"), basePath("/test"))).toBe("/test/a/b/target-file");
  });

  test("../", () => {
    expect(rewriteUrl("../", currentUri("/a/b"), basePath("/"))).toBe("/");
    expect(rewriteUrl("../", currentUri("/a/b/c"), basePath("/"))).toBe("/a");

    expect(rewriteUrl("../target-file", currentUri("/a/b"), basePath("/"))).toBe("/target-file");
    expect(rewriteUrl("../target-file", currentUri("/a/b/c"), basePath("/"))).toBe("/a/target-file");
    expect(rewriteUrl("../target-file", currentUri("/a/b/c/"), basePath("/"))).toBe("/a/target-file");

    expect(rewriteUrl("../target-file", currentUri("/a/b"), basePath("/test"))).toBe("/target-file");
    expect(rewriteUrl("../target-file", currentUri("/a/b/c"), basePath("/test"))).toBe("/a/target-file");
    expect(rewriteUrl("../target-file", currentUri("/a/b/c/"), basePath("/test"))).toBe("/a/target-file");

    // expect(rewriteUrl("../target-file", currentUri("/test"), basePath("/test"))).toBe("/target-file");
    expect(rewriteUrl("../target-file", currentUri("/test/a/b"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteUrl("../target-file", currentUri("/test/a/b/c"), basePath("/test"))).toBe("/test/a/target-file");
    expect(rewriteUrl("../target-file", currentUri("/test/a/b/c/"), basePath("/test"))).toBe("/test/a/target-file");
  });

  test("not start ./", () => {
    expect(rewriteUrl("target-file", currentUri("/"), basePath("/"))).toBe("/target-file");
    expect(rewriteUrl("target-file", currentUri("/a/b/c"), basePath("/"))).toBe("/a/b/target-file");
    expect(rewriteUrl("target-file", currentUri("/a/b/c/"), basePath("/"))).toBe("/a/b/target-file");

    expect(rewriteUrl("target-file", currentUri("/"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteUrl("target-file", currentUri("/a/b/c"), basePath("/test"))).toBe("/test/a/b/target-file");
    expect(rewriteUrl("target-file", currentUri("/a/b/c/"), basePath("/test"))).toBe("/test/a/b/target-file");

    expect(rewriteUrl("target-file", currentUri("/test"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteUrl("target-file", currentUri("/test/"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteUrl("target-file", currentUri("/test/a/b/c"), basePath("/test"))).toBe("/test/a/b/target-file");
    expect(rewriteUrl("target-file", currentUri("/test/a/b/c/"), basePath("/test"))).toBe("/test/a/b/target-file");
  });

  test("index path", () => {
    expect(rewriteUrl("index", currentUri("/"), basePath("/"))).toBe("/");
    expect(rewriteUrl("./index", currentUri("/"), basePath("/"))).toBe("/");
    expect(rewriteUrl("index", currentUri("/a"), basePath("/"))).toBe("/");
    expect(rewriteUrl("./index", currentUri("/a"), basePath("/"))).toBe("/");
  });
});
