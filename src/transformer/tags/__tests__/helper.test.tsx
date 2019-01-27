jest.unmock("../helpers");
import { PageState } from "@custom-site/page";

import { rewriteUrl } from "../helpers";

describe("Link Element", () => {
  const currentUri = (uri: string): PageState => ({
    uri,
    content: "",
    metaData: {},
    filename: "",
    name: "",
    raw: "",
    ext: "",
  });

  test("http,https", () => {
    expect(rewriteUrl("http://a", currentUri("/a/b/c"), "/")).toBe("http://a");
    expect(rewriteUrl("https://a", currentUri("/a/b/c/d"), "/")).toBe("https://a");
  });

  test("normal", () => {
    expect(rewriteUrl("/a/b/c", currentUri("/a/b/c"), "/")).toBe("/a/b/c");
    expect(rewriteUrl("/a/b/c", currentUri("/a/b/c/d"), "/")).toBe("/a/b/c");
  });

  test("add base path", () => {
    expect(rewriteUrl("/a/b/c", currentUri("/test/a/b/c"), "/test")).toBe("/test/a/b/c");
    expect(rewriteUrl("/a/b/c", currentUri("/test/a/b/c/d"), "/test")).toBe("/test/a/b/c");
  });

  test("./", () => {
    expect(rewriteUrl("./target-file", currentUri("/"), "/")).toBe("/target-file");
    expect(rewriteUrl("./target-file", currentUri("/a/b/c"), "/")).toBe("/a/b/target-file");
    expect(rewriteUrl("./target-file", currentUri("/a/b/c/"), "/")).toBe("/a/b/target-file");

    expect(rewriteUrl("./target-file", currentUri("/"), "/test")).toBe("/test/target-file");
    expect(rewriteUrl("./target-file", currentUri("/a/b/c"), "/test")).toBe("/test/a/b/target-file");
    expect(rewriteUrl("./target-file", currentUri("/a/b/c/"), "/test")).toBe("/test/a/b/target-file");

    expect(rewriteUrl("./target-file", currentUri("/test"), "/test")).toBe("/test/target-file");
    expect(rewriteUrl("./target-file", currentUri("/test/"), "/test")).toBe("/test/target-file");
    expect(rewriteUrl("./target-file", currentUri("/test/a/b/c"), "/test")).toBe("/test/a/b/target-file");
    expect(rewriteUrl("./target-file", currentUri("/test/a/b/c/"), "/test")).toBe("/test/a/b/target-file");
  });

  test("../", () => {
    expect(rewriteUrl("../", currentUri("/a/b"), "/")).toBe("/");
    expect(rewriteUrl("../", currentUri("/a/b/c"), "/")).toBe("/a");

    expect(rewriteUrl("../target-file", currentUri("/a/b"), "/")).toBe("/target-file");
    expect(rewriteUrl("../target-file", currentUri("/a/b/c"), "/")).toBe("/a/target-file");
    expect(rewriteUrl("../target-file", currentUri("/a/b/c/"), "/")).toBe("/a/target-file");

    expect(rewriteUrl("../target-file", currentUri("/a/b"), "/test")).toBe("/target-file");
    expect(rewriteUrl("../target-file", currentUri("/a/b/c"), "/test")).toBe("/a/target-file");
    expect(rewriteUrl("../target-file", currentUri("/a/b/c/"), "/test")).toBe("/a/target-file");

    // expect(rewriteUrl("../target-file", currentUri("/test"), "/test")).toBe("/target-file");
    expect(rewriteUrl("../target-file", currentUri("/test/a/b"), "/test")).toBe("/test/target-file");
    expect(rewriteUrl("../target-file", currentUri("/test/a/b/c"), "/test")).toBe("/test/a/target-file");
    expect(rewriteUrl("../target-file", currentUri("/test/a/b/c/"), "/test")).toBe("/test/a/target-file");
  });

  test("not start ./", () => {
    expect(rewriteUrl("target-file", currentUri("/"), "/")).toBe("/target-file");
    expect(rewriteUrl("target-file", currentUri("/a/b/c"), "/")).toBe("/a/b/target-file");
    expect(rewriteUrl("target-file", currentUri("/a/b/c/"), "/")).toBe("/a/b/target-file");

    expect(rewriteUrl("target-file", currentUri("/"), "/test")).toBe("/test/target-file");
    expect(rewriteUrl("target-file", currentUri("/a/b/c"), "/test")).toBe("/test/a/b/target-file");
    expect(rewriteUrl("target-file", currentUri("/a/b/c/"), "/test")).toBe("/test/a/b/target-file");

    expect(rewriteUrl("target-file", currentUri("/test"), "/test")).toBe("/test/target-file");
    expect(rewriteUrl("target-file", currentUri("/test/"), "/test")).toBe("/test/target-file");
    expect(rewriteUrl("target-file", currentUri("/test/a/b/c"), "/test")).toBe("/test/a/b/target-file");
    expect(rewriteUrl("target-file", currentUri("/test/a/b/c/"), "/test")).toBe("/test/a/b/target-file");
  });

  test("index path", () => {
    expect(rewriteUrl("index", currentUri("/"), "/")).toBe("/");
    expect(rewriteUrl("./index", currentUri("/"), "/")).toBe("/");
    expect(rewriteUrl("index", currentUri("/a"), "/")).toBe("/");
    expect(rewriteUrl("./index", currentUri("/a"), "/")).toBe("/");
  });
});
