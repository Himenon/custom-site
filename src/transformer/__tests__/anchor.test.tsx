jest.unmock("../converter.tsx");
import * as ReactDOM from "react-dom/server";
import { transformRawStringToHtml } from "../converter";

describe("anchore tag link", () => {
  const converter = (rawString: string) =>
    ReactDOM.renderToStaticMarkup(
      transformRawStringToHtml({
        customComponents: {},
        props: {},
      })(rawString),
    );

  test("/", () => {
    const result = converter("[link](/)");
    expect(result).toBe('<body><div><p><a href="/">link</a></p></div></body>');
  });

  test("/index", () => {
    const result = converter("[link](/index)");
    expect(result).toBe('<body><div><p><a href="/index">link</a></p></div></body>');
  });

  test("../index", () => {
    const result = converter("[link](../index)");
    expect(result).toBe('<body><div><p><a href="../index">link</a></p></div></body>');
  });
});
