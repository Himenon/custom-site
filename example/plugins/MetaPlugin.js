"use strict";
// tslint:disable-next-line:no-reference
/// <reference path="../../typings/@custom-site/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.onGenerateMetaData = payload => {
    const page = payload.page;
    const newMetaData = {
        extend: {
            meta: [
                {
                    property: "og:title",
                    content: page.metaData.title,
                },
                {
                    property: "og:url",
                    content: page.uri,
                },
            ],
        },
    };
    payload.page.metaData = { ...payload.page.metaData, ...newMetaData };
    return payload;
};
