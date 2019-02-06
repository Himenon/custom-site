"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ExampleComponent extends React.Component {
    render() {
        return (React.createElement("div", { className: "my-component" },
            this.props.children,
            " ",
            this.props.x * this.props.y));
    }
}
exports.ExampleComponent = ExampleComponent;
