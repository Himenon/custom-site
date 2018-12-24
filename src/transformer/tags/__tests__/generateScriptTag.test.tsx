jest.unmock("../generateScriptElements");
import { HtmlMetaProperties } from "@rocu/page";
import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { generateScriptElements, trimScriptSourcePath } from "../generateScriptElements";

describe("Generate Script Tag", () => {
  const generator = (params: HtmlMetaProperties) => ReactDOM.renderToStaticMarkup(<div>{generateScriptElements(params)}</div>);

  test("trimScriptSourcePath", () => {
    expect(trimScriptSourcePath("./a/b/c", true)).toBe("./a/b/c");
    expect(trimScriptSourcePath("./a/b/c", false)).toBe("/a/b/c");
    expect(trimScriptSourcePath("/a/b/c", true)).toBe("./a/b/c");
    expect(trimScriptSourcePath("/a/b/c", false)).toBe("/a/b/c");
    expect(trimScriptSourcePath("a/b/c", true)).toBe("./a/b/c");
    expect(trimScriptSourcePath("a/b/c", false)).toBe("/a/b/c");
    expect(trimScriptSourcePath("http://a/b/c", true)).toBe("http://a/b/c");
    expect(trimScriptSourcePath("http://a/b/c", false)).toBe("http://a/b/c");
    expect(trimScriptSourcePath("https://a/b/c", true)).toBe("https://a/b/c");
    expect(trimScriptSourcePath("https://a/b/c", false)).toBe("https://a/b/c");
  });

  test("generateScriptTag", () => {
    const domString = generator({
      localScripts: [
        "./a/b/c.js",
        {
          async: true,
          src: "./a/b/d.js",
        },
        "./a/b/c.js",
        {},
      ],
      globalScripts: [
        {
          src: "/a.js",
        },
        {
          src: "/a.js",
        },
        {},
      ],
    });
    expect(domString).toBe(
      '<div><script src="/a.js"></script><script src="./a/b/c.js"></script><script async="" src="./a/b/d.js"></script></div>',
    );
  });

  test("no params", () => {
    expect(generator({})).toBe("<div></div>");
    expect(generator({ globalScripts: undefined, localScripts: undefined })).toBe("<div></div>");
    expect(generator({ globalScripts: [], localScripts: [] })).toBe("<div></div>");
  });
});
