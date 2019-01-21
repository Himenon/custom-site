jest.unmock("../createTemplate");
import { Post } from "@custom-site/page";
import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { createTemplateHOC } from "../createTemplate";

describe("rendering test", () => {
  const pageProps: Post = {
    site: {
      title: "",
      description: "",
      url: {
        relativePath: "",
        absolutePath: "",
      },
    },
    article: {
      title: "",
      description: "",
      url: {
        relativePath: "",
        absolutePath: "",
      },
    },
  };
  test("Component", () => {
    // tslint:disable-next-line:variable-name
    const Component = class extends React.Component<{ name: string }, {}> {
      public render() {
        return <div>{this.props.name}</div>;
      }
    };
    const result = ReactDOM.renderToStaticMarkup(<Component name="test" />);
    expect(result).toBe("<div>test</div>");
  });

  test("createTemplate", () => {
    const wrapper = createTemplateHOC({ pageProps });
    const element = wrapper(<div>{"hello"}</div>);
    const result = ReactDOM.renderToStaticMarkup(element);
    expect(result).toBe("<body><div>hello</div></body>");
  });

  test("custom template", () => {
    const applyLayout = (_props: Post) => (content?: React.ReactNode): React.ReactElement<any> => {
      return (
        <body id="my-template">
          <main>{content}</main>
        </body>
      );
    };
    const wrapper = createTemplateHOC({
      pageProps,
      createTemplateFunction: applyLayout,
    });
    const element = wrapper(<div>{"hello"}</div>);
    const result = ReactDOM.renderToStaticMarkup(element);
    expect(result).toBe('<body id="my-template"><main><div>hello</div></main></body>');
  });
});
