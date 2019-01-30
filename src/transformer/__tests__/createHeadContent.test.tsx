jest.unmock("../createHeadContent.tsx");
jest.unmock("../tags/generateScriptElements.tsx");
jest.unmock("../tags/generateLinkElements.tsx");
import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { convertMetaHTMLAttributes, createHeadContent, generateMetaElements, generateViewportMetaAttributes } from "../createHeadContent";

describe("Create Head Content Test", () => {
  test("generateViewportMetaTag", () => {
    const props = generateViewportMetaAttributes({
      viewport: {
        "initial-scale": "1.0",
      },
    });
    expect(ReactDOM.renderToStaticMarkup(<meta {...props} />)).toBe(`<meta name="viewport" content="initial-scale=1.0"/>`);
  });

  test("generateMetaElements length", () => {
    const elements = generateMetaElements([]);
    expect(elements.length).toBe(0);
  });

  test("extend twitter card", () => {
    const elements = generateMetaElements([
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:site",
        content: "@twitter",
      },
    ]);
    expect(ReactDOM.renderToStaticMarkup(elements[0])).toBe('<meta name="twitter:card" content="summary"/>');
    expect(ReactDOM.renderToStaticMarkup(elements[1])).toBe('<meta name="twitter:site" content="@twitter"/>');
  });

  test("charSet test", () => {
    const props = convertMetaHTMLAttributes({});
    expect(props.length).toBe(1);
    expect(props[0].key).toBe("charset");
    expect(props[0].charSet).toBe("utf-8");
  });

  test("extend parameter", () => {
    const extendParameter = {
      name: "twitter:card",
      content: "summary",
    };
    const props = convertMetaHTMLAttributes({
      extend: {
        meta: [
          {
            name: "twitter:card",
            content: "summary",
          },
        ],
      },
    });
    expect(props.length).toBe(2);
    expect(props[1].name).toEqual(extendParameter.name);
    expect(props[1].content).toEqual(extendParameter.content);
  });

  test("createHeadContent default params render", () => {
    const element = createHeadContent({});
    expect(ReactDOM.renderToStaticMarkup(element)).toBe('<head lang="en"><title></title><meta charSet="utf-8"/></head>');
  });

  test("createHeadContent extend script", () => {
    const element = createHeadContent({
      extend: {
        script: [
          {
            src: "/extends/c.js",
          },
        ],
      },
    });
    expect(ReactDOM.renderToStaticMarkup(element)).toBe(
      '<head lang="en"><title></title><meta charSet="utf-8"/><script src="/extends/c.js"></script></head>',
    );
  });

  test("createHeadContent extend script", () => {
    const element = createHeadContent({
      extend: {
        link: [
          {
            rel: "stylesheet",
            href: "/extends/c.css",
          },
        ],
      },
    });
    expect(ReactDOM.renderToStaticMarkup(element)).toBe(
      '<head lang="en"><title></title><meta charSet="utf-8"/><link rel="stylesheet" href="/extends/c.css"/></head>',
    );
  });
});
