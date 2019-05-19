jest.unmock("../createBodyContent.tsx");
import * as ReactDOM from "react-dom/server";
import { transformRawStringToHtml } from "../createBodyContent";

describe("anchor tag link", () => {
  const converter = (rawString: string) =>
    ReactDOM.renderToStaticMarkup(
      transformRawStringToHtml({
        customComponents: {},
        props: {},
      })(rawString),
    );

  test("/", () => {
    const result = converter("[link](/)");
    expect(result).toBe('<p><a href="/">link</a></p>');
  });

  test("/index", () => {
    const result = converter("[link](/index)");
    expect(result).toBe('<p><a href="/index">link</a></p>');
  });

  test("../index", () => {
    const result = converter("[link](../index)");
    expect(result).toBe('<p><a href="../index">link</a></p>');
  });
});
