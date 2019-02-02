"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const mainContent = (_props, content) => {
    return (React.createElement("div", { className: "wrapper" },
        React.createElement("section", null,
            React.createElement("main", { className: "page-content" }, content))));
};
const wrappedContent = (props, content) => {
    return (React.createElement("body", null,
        React.createElement("header", { className: "site-header" },
            React.createElement("h1", { className: "site-title" },
                React.createElement("a", { className: "site-title-text", href: props.site.baseUrl }, props.site.title))),
        mainContent(props, content)));
};
exports.createBodyTemplateFunction = (props) => (content) => {
    return wrappedContent(props, content);
};
