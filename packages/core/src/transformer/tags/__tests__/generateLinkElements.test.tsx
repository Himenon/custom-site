jest.unmock("../generateLinkElements.tsx");
import { HtmlMetaData } from "@custom-site/interfaces/lib/page";
import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { generateLinkElements } from "../generateLinkElements";

describe("Link Element", () => {
  const generator = (params: HtmlMetaData) => ReactDOM.renderToStaticMarkup(<head>{generateLinkElements(params)}</head>);

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
    expect(domString).toMatch(/link href=".\/a\/b\/d.css\?/);
    expect(domString).toMatch(/link href="a\/b\/c.css\?/);
    expect(domString).toMatch(/link href="a.css\?/);
  });

  test("no params", () => {
    expect(generator({})).toBe("<head></head>");
    expect(generator({ globalLinks: undefined, localLinks: undefined })).toBe("<head></head>");
    expect(generator({ globalLinks: [], localLinks: [] })).toBe("<head></head>");
  });
});
