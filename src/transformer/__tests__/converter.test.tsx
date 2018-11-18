jest.unmock("../converter.tsx");
import * as ReactDOM from "react-dom/server";
import { transformRawStringToHtml } from "../converter";

describe("transformer test", () => {
  const templateText: string = `
# Hello World

body message

## h2 title

highlight
`;

  const resultTest = "<div><h1>Hello World</h1><p>body message</p><h2>h2 title</h2><p>highlight</p></div>";

  test("default converter", () => {
    const converter = transformRawStringToHtml({
      customComponents: {},
      props: {},
    });
    const component = converter(templateText);
    const renderResult = ReactDOM.renderToStaticMarkup(component);
    expect(renderResult).toEqual(resultTest);
  });
});
