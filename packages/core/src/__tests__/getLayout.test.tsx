jest.unmock("../createTemplate");
import { PostProps } from "@custom-site/interfaces/lib/page";
import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { createTemplateHOC } from "../createTemplate";

describe("rendering test", () => {
  const pageProps: PostProps = {
    site: {
      title: "",
      description: "",
      baseUri: "",
      baseUrl: "",
    },
    page: {
      uri: "",
      content: "",
      metaData: {},
      ext: "",
      filename: "",
      name: "",
      raw: "",
    },
    indexes: [],
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
    const wrapper = createTemplateHOC({ postProps: pageProps });
    const element = wrapper(<div>{"hello"}</div>);
    const result = ReactDOM.renderToStaticMarkup(element);
    expect(result).toBe("<div>hello</div>");
  });

  test("custom template", () => {
    const applyLayout = (_props: PostProps) => (content?: React.ReactNode): React.ReactElement<any> => {
      return (
        <>
          <main id="my-template">{content}</main>
        </>
      );
    };
    const wrapper = createTemplateHOC({
      postProps: pageProps,
      createTemplateFunction: applyLayout,
    });
    const element = wrapper(<div>{"hello"}</div>);
    const result = ReactDOM.renderToStaticMarkup(element);
    expect(result).toBe('<main id="my-template"><div>hello</div></main>');
  });
});
