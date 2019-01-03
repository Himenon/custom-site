"use strict";
// tslint:disable-next-line:no-reference
/// <reference path="../typings/@custom-site/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const wrappedContent = (content) => {
    return React.createElement("div", { id: "content" }, content);
};
exports.bodyTemplate = (props) => (content) => {
    const newContent = wrappedContent(content);
    return (React.createElement("body", { id: "custom-template" },
        React.createElement("h1", null, props.site.title),
        React.createElement("pre", null, JSON.stringify(props, null, 2)),
        newContent));
};
