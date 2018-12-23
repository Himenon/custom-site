jest.unmock("../createHeadContent.tsx");
import * as ReactDOM from "react-dom/server";
import { generateViewportMetaTag } from "../createHeadContent";

describe("Create Head Content Test", () => {
  test("generateViewportMetaTag", () => {
    const vdom = generateViewportMetaTag({
      "initial-scale": "1.0",
    });
    expect(ReactDOM.renderToStaticMarkup(vdom)).toBe(`<meta name="viewport" content="initial-scale=1.0"/>`);
  });
});
