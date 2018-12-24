jest.unmock("../createHeadContent.tsx");
import * as ReactDOM from "react-dom/server";
import { generateViewportMetaElements } from "../createHeadContent";

describe("Create Head Content Test", () => {
  test("generateViewportMetaTag", () => {
    const vdom = generateViewportMetaElements({
      viewport: {
        "initial-scale": "1.0",
      },
    });
    expect(ReactDOM.renderToStaticMarkup(vdom!)).toBe(`<meta name="viewport" content="initial-scale=1.0"/>`);
  });
});
