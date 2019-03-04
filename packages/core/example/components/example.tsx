import * as React from "react";

export interface ExampleComponentProps {
  x: number;
  y: number;
}

export class ExampleComponent extends React.Component<ExampleComponentProps, {}> {
  public render() {
    return (
      <div className="my-component">
        {this.props.children} {this.props.x * this.props.y}
      </div>
    );
  }
}
