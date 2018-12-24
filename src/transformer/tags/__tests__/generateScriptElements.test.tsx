jest.unmock("../generateScriptElements");
jest.unmock("../normalizer");
import { HtmlMetaProperties } from "@rocu/page";
import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { generateScriptElements } from "../generateScriptElements";

describe("Script Element", () => {
  const generator = (params: HtmlMetaProperties) => ReactDOM.renderToStaticMarkup(<head>{generateScriptElements(params)}</head>);

  test("generate script elements", () => {
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
      '<head><script src="/a.js"></script><script src="./a/b/c.js"></script><script async="" src="./a/b/d.js"></script></head>',
    );
  });

  test("no params", () => {
    expect(generator({})).toBe("<head></head>");
    expect(generator({ globalScripts: undefined, localScripts: undefined })).toBe("<head></head>");
    expect(generator({ globalScripts: [], localScripts: [] })).toBe("<head></head>");
  });
});
