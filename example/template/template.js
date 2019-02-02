"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const urljoin = require("url-join");
const createIndexes = (props) => {
    const elements = props.indexes.map(index => {
        return (React.createElement("li", null,
            React.createElement("a", { href: index.uri }, index.title)));
    });
    return (React.createElement("div", { className: "site-indexes" },
        React.createElement("header", { className: "site-index-header" }),
        React.createElement("ul", null, elements)));
};
const createTagElement = (tags) => {
    const items = tags.map(tag => React.createElement("li", { className: "tag-item" }, tag));
    return React.createElement("ul", { className: "tag-list" }, items);
};
const mainContent = (props, content) => {
    const tags = props.page.metaData.tags ? props.page.metaData.tags.split(",") : [];
    return (React.createElement("div", { className: "wrapper" },
        React.createElement("main", { className: "page-content" },
            React.createElement("header", { className: "post-header" },
                React.createElement("h1", null, props.page.metaData.title),
                createTagElement(tags)),
            content)));
};
const wrappedContent = (props, content) => {
    return (React.createElement("body", null,
        createIndexes(props),
        React.createElement("div", { className: "site-wrapper" },
            React.createElement("header", { className: "site-header" },
                React.createElement("h1", { className: "site-title" },
                    React.createElement("a", { className: "site-title-text", href: urljoin(props.site.baseUrl, props.site.baseUri) }, props.site.title))),
            mainContent(props, content))));
};
exports.createBodyTemplateFunction = (props) => (content) => {
    return wrappedContent(props, content);
};
