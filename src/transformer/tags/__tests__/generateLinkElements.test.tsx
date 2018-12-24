jest.unmock("../generateLinkElements.tsx");
jest.unmock("../normalizer");
import { HtmlMetaProperties } from "@rocu/page";
import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { generateLinkElements } from "../generateLinkElements";

describe("Link Element", () => {
  const generator = (params: HtmlMetaProperties) => ReactDOM.renderToStaticMarkup(<head>{generateLinkElements(params)}</head>);

  test("generate link elements", () => {
    const domString = generator({
      localLinks: [
        "./a/b/c.css",
        {
          href: "./a/b/d.css",
        },
        "a/b/c.css",
      ],
      globalLinks: [
        {
          href: "/a.css",
        },
        {
          href: "a.css",
        },
        {},
      ],
    });
    // tslint:disable max-line-length
    expect(domString).toBe(
      '<head><link href="/a.css" src="/a.css"/><link href="./a/b/c.css"/><link href="./a/b/d.css" src="./a/b/d.css"/><link href="./a/b/c.css"/></head>',
    );
  });

  test("no params", () => {
    expect(generator({})).toBe("<head></head>");
    expect(generator({ globalLinks: undefined, localLinks: undefined })).toBe("<head></head>");
    expect(generator({ globalLinks: [], localLinks: [] })).toBe("<head></head>");
  });
});
