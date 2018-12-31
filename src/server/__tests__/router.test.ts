jest.unmock("../server.ts");
import { DevelopOption } from "@rocu/cli";
import { redirectPath } from "../server";

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
    expect(redirectPath("/", option1)).toBe("/index");
    expect(redirectPath("/index", option1)).toBe("/index");
    expect(redirectPath("/index/", option1)).toBe("/index/");
    expect(redirectPath("/hoge", option1)).toBe("/hoge");
  });

  test("use server base path", () => {
    expect(redirectPath("/", option2)).toBe("/index");
    expect(redirectPath("/index", option2)).toBe("/index");
    expect(redirectPath("/index/", option2)).toBe("/index/");
    expect(redirectPath("/test", option2)).toBe("/test/index");
    expect(redirectPath("/hoge", option2)).toBe("/hoge");
    expect(redirectPath("/test/hoge", option2)).toBe("/test/hoge");
  });
});
