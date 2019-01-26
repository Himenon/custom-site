import { PageState } from "@custom-site/page";
import * as path from "path";

/**
 * @param uri aタグの`href`, imgタグの`src`
 * @param page `page.uri`は`option.basePath`をすでに加算した状態で存在する
 * @param option 相対パスの算出では利用しない
 */
export const rewriteUrl = (uri: string, page: PageState, basePath: string): string => {
  let calcUri: string = uri;
  if (uri.match(/^https?\:\/\/|^\/\//) !== null) {
    return uri;
  }
  if (uri.endsWith("index")) {
    calcUri = calcUri.slice(0, uri.length - "index".length);
  }
  if (uri.startsWith("/")) {
    return path.join(basePath, calcUri);
  }
  if (uri.startsWith("../")) {
    const s = path.join(path.dirname(page.uri), calcUri);
    return s === "/" ? s : s.replace(/\/$/, "");
  }
  // start current directory
  const newUri = path.join("/", path.dirname(page.uri), calcUri).replace(/\/$/, "");
  if (basePath !== "" && !newUri.startsWith(basePath)) {
    return path.join(basePath, newUri);
  }
  return newUri;
};
