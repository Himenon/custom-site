jest.unmock("../createBodyContent.tsx");
import * as path from "path";
import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { transformRawStringToHtml } from "../createBodyContent";

describe("Custom Component Test", () => {
  test("custom base path anchor tag", () => {
    const converter = transformRawStringToHtml({
      customComponents: {
        a: (props: JSX.IntrinsicElements["a"]) => {
          const customProps: JSX.IntrinsicElements["a"] = { ...props, href: path.join("/basepath", props.href || "") };
          return <a {...customProps} />;
        },
      },
      props: {},
    });

    const component = converter("[link](/a/b/c)");
    const result = ReactDOM.renderToStaticMarkup(component);
    expect(result).toBe('<p><a href="/basepath/a/b/c">link</a></p>');
  });
});
