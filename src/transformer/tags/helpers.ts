import { CommonOption } from "@custom-site/cli";
import { PageElement } from "@custom-site/page";
import * as path from "path";

/**
 * @param uri aタグの`href`, imgタグの`src`
 * @param page page.uriはoption.serverBasePathをすでに加算した状態で存在する
 * @param option 相対パスの算出では利用しない
 */
export const rewriteUrl = (uri: string, page: PageElement, option: CommonOption): string => {
  let calcUri: string = uri;
  if (uri.match(/^https?\:\/\/|^\/\//) !== null) {
    return uri;
  }
  if (uri.endsWith("index")) {
    calcUri = calcUri.slice(0, uri.length - "index".length);
  }
  if (uri.startsWith("/")) {
    return path.join(option.basePath, calcUri);
  }
  if (uri.startsWith("../")) {
    const s = path.join(path.dirname(page.uri), calcUri);
    return s === "/" ? s : s.replace(/\/$/, "");
  }
  // start current directory
  const newUri = path.join("/", path.dirname(page.uri), calcUri).replace(/\/$/, "");
  if (option.basePath !== "" && !newUri.startsWith(option.basePath)) {
    return path.join(option.basePath, newUri);
  }
  return newUri;
};
