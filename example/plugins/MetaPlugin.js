"use strict";
// tslint:disable-next-line:no-reference
/// <reference path="../../typings/@custom-site/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.onGenerateMetaData = payload => {
    const oldMetaData = payload.metaData;
    const newMetaData = {
        ...oldMetaData,
        "og:title": oldMetaData.title,
    };
    return {
        metaData: newMetaData,
    };
};
