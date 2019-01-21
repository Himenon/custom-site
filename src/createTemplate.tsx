import { Template } from "@custom-site/page";
import * as React from "react";

export const createTemplateComponent = (props: Template) => {
  const applyTemplate = props.createTemplateFunction && props.createTemplateFunction(props.pageProps);
  return class extends React.Component<{}, {}> {
    public render() {
      if (applyTemplate) {
        return applyTemplate(this.props.children);
      }
      return <body>{this.props.children}</body>;
    }
  };
};

export const createTemplateHOC = (props: Template) => (bodyContent: React.ReactElement<any>): React.ReactElement<any> => {
  // tslint:disable-next-line:variable-name
  const TemplateComponent = createTemplateComponent(props);
  return <TemplateComponent children={bodyContent} />;
};
