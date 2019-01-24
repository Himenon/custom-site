jest.unmock("../server.ts");
import { DevelopOption } from "@custom-site/config";
import { getRedirectPagePath } from "../server";

describe("routing test", () => {
  const option1: DevelopOption = {
    source: "",
    global: {},
    basePath: "/",
    port: 9000,
    blacklist: {
      extensions: [],
    },
    plugins: [],
  };

  const option2: DevelopOption = {
    source: "",
    global: {},
    basePath: "/test",
    port: 9000,
    blacklist: {
      extensions: [],
    },
    plugins: [],
  };

  test("default redirect path", () => {
    expect(getRedirectPagePath("/", option1)).toBe("/index");
    expect(getRedirectPagePath("/index", option1)).toBe("/index");
    expect(getRedirectPagePath("/index/", option1)).toBe("/index");
    expect(getRedirectPagePath("/hoge", option1)).toBe("/hoge");
  });

  test("use server base path", () => {
    expect(getRedirectPagePath("/", option2)).toBe("/index");
    expect(getRedirectPagePath("/index", option2)).toBe("/index");
    expect(getRedirectPagePath("/index/", option2)).toBe("/index");
    expect(getRedirectPagePath("/test", option2)).toBe("/test/index");
    expect(getRedirectPagePath("/hoge", option2)).toBe("/hoge");
    expect(getRedirectPagePath("/test/hoge", option2)).toBe("/test/hoge");
  });
});
