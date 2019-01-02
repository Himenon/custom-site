"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const wrappedContent = (content) => {
    return React.createElement("div", { id: "content" }, content);
};
exports.bodyTemplate = (props) => (content) => {
    const newContent = wrappedContent(content);
    return React.createElement("body", { id: "custom-template" }, newContent);
};
