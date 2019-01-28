"use strict";
// tslint:disable-next-line:no-reference
/// <reference path="../../typings/@custom-site/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.onGenerateMetaData = payload => {
    const page = payload.page;
    const newMetaData = {
        "og:title": page.metaData.title,
        "og:url": page.uri,
    };
    payload.page.metaData = { ...payload.page.metaData, ...newMetaData };
    return payload;
};
