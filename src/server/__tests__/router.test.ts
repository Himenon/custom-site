jest.unmock("../server.ts");
import { DevelopOption } from "@rocu/cli";
import { redirectPagePath } from "../server";

describe("routing test", () => {
  const option1: DevelopOption = {
    source: "",
    serverBasePath: "/",
    blacklist: {
      extensions: [],
    },
  };

  const option2: DevelopOption = {
    source: "",
    serverBasePath: "/test",
    blacklist: {
      extensions: [],
    },
  };

  test("default redirect path", () => {
    expect(redirectPagePath("/", option1)).toBe("/index");
    expect(redirectPagePath("/index", option1)).toBe("/index");
    expect(redirectPagePath("/index/", option1)).toBe("/index/");
    expect(redirectPagePath("/hoge", option1)).toBe("/hoge");
  });

  test("use server base path", () => {
    expect(redirectPagePath("/", option2)).toBe("/index");
    expect(redirectPagePath("/index", option2)).toBe("/index");
    expect(redirectPagePath("/index/", option2)).toBe("/index/");
    expect(redirectPagePath("/test", option2)).toBe("/test/index");
    expect(redirectPagePath("/hoge", option2)).toBe("/hoge");
    expect(redirectPagePath("/test/hoge", option2)).toBe("/test/hoge");
  });
});
