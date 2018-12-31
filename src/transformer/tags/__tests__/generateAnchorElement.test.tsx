jest.unmock("../generateAnchorElement");
import { CommonOption } from "@rocu/cli";
import { PageElement } from "@rocu/page";

import { rewriteHyperReference } from "../generateAnchorElement";

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
    serverBasePath,
    blacklist: {
      extensions: [],
    },
  });
  test("normal", () => {
    expect(rewriteHyperReference("/a/b/c", currentUri("/a/b/c"), basePath("/"))).toBe("/a/b/c");
    expect(rewriteHyperReference("/a/b/c", currentUri("/a/b/c/d"), basePath("/"))).toBe("/a/b/c");
  });

  test("add base path", () => {
    expect(rewriteHyperReference("/a/b/c", currentUri("/test/a/b/c"), basePath("/test"))).toBe("/test/a/b/c");
    expect(rewriteHyperReference("/a/b/c", currentUri("/test/a/b/c/d"), basePath("/test"))).toBe("/test/a/b/c");
  });

  test("./", () => {
    expect(rewriteHyperReference("./target-file", currentUri("/"), basePath("/"))).toBe("/target-file");
    expect(rewriteHyperReference("./target-file", currentUri("/a/b/c"), basePath("/"))).toBe("/a/b/target-file");
    expect(rewriteHyperReference("./target-file", currentUri("/a/b/c/"), basePath("/"))).toBe("/a/b/target-file");

    expect(rewriteHyperReference("./target-file", currentUri("/"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteHyperReference("./target-file", currentUri("/a/b/c"), basePath("/test"))).toBe("/test/a/b/target-file");
    expect(rewriteHyperReference("./target-file", currentUri("/a/b/c/"), basePath("/test"))).toBe("/test/a/b/target-file");

    expect(rewriteHyperReference("./target-file", currentUri("/test"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteHyperReference("./target-file", currentUri("/test/"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteHyperReference("./target-file", currentUri("/test/a/b/c"), basePath("/test"))).toBe("/test/a/b/target-file");
    expect(rewriteHyperReference("./target-file", currentUri("/test/a/b/c/"), basePath("/test"))).toBe("/test/a/b/target-file");
  });

  test("../", () => {
    expect(rewriteHyperReference("../", currentUri("/a/b"), basePath("/"))).toBe("/");
    expect(rewriteHyperReference("../", currentUri("/a/b/c"), basePath("/"))).toBe("/a");

    expect(rewriteHyperReference("../target-file", currentUri("/a/b"), basePath("/"))).toBe("/target-file");
    expect(rewriteHyperReference("../target-file", currentUri("/a/b/c"), basePath("/"))).toBe("/a/target-file");
    expect(rewriteHyperReference("../target-file", currentUri("/a/b/c/"), basePath("/"))).toBe("/a/target-file");

    expect(rewriteHyperReference("../target-file", currentUri("/a/b"), basePath("/test"))).toBe("/target-file");
    expect(rewriteHyperReference("../target-file", currentUri("/a/b/c"), basePath("/test"))).toBe("/a/target-file");
    expect(rewriteHyperReference("../target-file", currentUri("/a/b/c/"), basePath("/test"))).toBe("/a/target-file");

    // expect(rewriteHyperReference("../target-file", currentUri("/test"), basePath("/test"))).toBe("/target-file");
    expect(rewriteHyperReference("../target-file", currentUri("/test/a/b"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteHyperReference("../target-file", currentUri("/test/a/b/c"), basePath("/test"))).toBe("/test/a/target-file");
    expect(rewriteHyperReference("../target-file", currentUri("/test/a/b/c/"), basePath("/test"))).toBe("/test/a/target-file");
  });

  test("not start ./", () => {
    expect(rewriteHyperReference("target-file", currentUri("/"), basePath("/"))).toBe("/target-file");
    expect(rewriteHyperReference("target-file", currentUri("/a/b/c"), basePath("/"))).toBe("/a/b/target-file");
    expect(rewriteHyperReference("target-file", currentUri("/a/b/c/"), basePath("/"))).toBe("/a/b/target-file");

    expect(rewriteHyperReference("target-file", currentUri("/"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteHyperReference("target-file", currentUri("/a/b/c"), basePath("/test"))).toBe("/test/a/b/target-file");
    expect(rewriteHyperReference("target-file", currentUri("/a/b/c/"), basePath("/test"))).toBe("/test/a/b/target-file");

    expect(rewriteHyperReference("target-file", currentUri("/test"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteHyperReference("target-file", currentUri("/test/"), basePath("/test"))).toBe("/test/target-file");
    expect(rewriteHyperReference("target-file", currentUri("/test/a/b/c"), basePath("/test"))).toBe("/test/a/b/target-file");
    expect(rewriteHyperReference("target-file", currentUri("/test/a/b/c/"), basePath("/test"))).toBe("/test/a/b/target-file");
  });
});
