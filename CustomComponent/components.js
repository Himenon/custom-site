"use strict";
// tslint:disable-next-line:no-reference
/// <reference path="../typings/@mdx-js/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.generateCustomComponents = () => {
    return {
        h1: props => {
            return (React.createElement("div", { className: "custom-component-title" },
                React.createElement("h2", Object.assign({}, props))));
        },
    };
};
