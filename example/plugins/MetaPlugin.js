"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
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
                    content: path.join(payload.site.baseUrl, page.uri),
                },
            ],
        },
    };
    payload.page.metaData = { ...payload.page.metaData, ...newMetaData };
    return payload;
};
