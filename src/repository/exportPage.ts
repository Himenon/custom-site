import * as fs from "fs";
import * as path from "path";

import { RenderedStaticPage } from "@rocu/page";

const exportPages = async (pages: RenderedStaticPage[], dest: string): Promise<void> => {
  /**
   * ファイルの出力先の確認
   */
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  /**
   * ファイル書き込みの非同期Prmise[]を生成
   */
  const promises = pages.map(async (page: RenderedStaticPage) => {
    const dir = page.name === "index" ? "" : page.name;
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
