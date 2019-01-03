import { TemplateProps } from "@custom-site/page";
import * as React from "react";

export const createTemplateComponent = (props: TemplateProps) => {
  const makeLayout = props.applyLayout && props.applyLayout(props.pageProps);
  return class extends React.Component<{}, {}> {
    public render() {
      if (makeLayout) {
        return makeLayout(this.props.children);
      }
      return <body>{this.props.children}</body>;
    }
  };
};

export const createTemplate = (props: TemplateProps) => (bodyContent: React.ReactElement<any>): React.ReactElement<any> => {
  // tslint:disable-next-line:variable-name
  const Template = createTemplateComponent(props);
  return <Template children={bodyContent} />;
};
