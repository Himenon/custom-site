import * as fs from "fs";
import * as path from "path";

import { BuildOption } from "@custom-site/config";
import { RenderedStaticPage } from "@custom-site/page";

/**
 * TODO config.jsonの link,script のファイルをコピー対象に含める
 */
const exportPages = async (pages: RenderedStaticPage[], option: BuildOption): Promise<void> => {
  const dest = option.destination;
  /**
   * ファイルの出力先の確認
   */
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  /**
   * ファイル書き込みの非同期Prmise[]を生成
   */
  const promises = pages.map(async (page: RenderedStaticPage) => {
    // TODO Redirectの手順を一つにまとめる
    const dir = page.originalName.endsWith("index") ? path.dirname(page.originalName) : page.originalName;
    const filename = path.join(dest, dir, "index.html");
    if (!fs.existsSync(path.dirname(filename))) {
      fs.mkdirSync(path.dirname(filename), { recursive: true });
    }
    return fs.writeFileSync(filename, page.html);
  });

  const results = await Promise.all(promises);
  // エラーがある場合は、その結果を出力
  results.map(result => result !== undefined && console.error(result));

  return Promise.resolve();
};

export { exportPages };
