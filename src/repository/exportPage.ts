import * as fs from "fs";
import * as path from "path";

import { Options } from "@rocu/cli";
import { RenderedStaticPage } from "@rocu/page";

const exportPages = async (pages: RenderedStaticPage[], opts: Options): Promise<void> => {
  const { outDir } = opts;
  /**
   * ファイルの出力先の確認
   */
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  /**
   * ファイル書き込みの非同期Prmise[]を生成
   */
  const promises = pages.map(async (page: RenderedStaticPage) => {
    const dir = page.name === "index" ? "" : page.name;
    const filename = path.join(outDir, dir, "index.html");
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
