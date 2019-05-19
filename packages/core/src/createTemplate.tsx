import { TemplateProps } from "@custom-site/interfaces/lib/page";
import * as React from "react";

export const createTemplateComponent = (props: TemplateProps) => {
  const applyTemplate = props.createTemplateFunction && props.createTemplateFunction(props.postProps);
  return class extends React.Component<{}, {}> {
    public render() {
      if (applyTemplate) {
        return applyTemplate(this.props.children);
      }
      return <>{this.props.children}</>;
    }
  };
};

export const createTemplateHOC = (props: TemplateProps) => (bodyContent: React.ReactElement<any>): React.ReactElement<any> => {
  // tslint:disable-next-line:variable-name
  const TemplateComponent = createTemplateComponent(props);
  return <TemplateComponent children={bodyContent} />;
};
