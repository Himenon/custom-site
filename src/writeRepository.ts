import * as fs from "fs";
import * as path from "path";
import * as util from "util";

import { Options } from "@rocu/cli";
import { RenderedStaticPage } from "@rocu/page";

const write = util.promisify(fs.writeFile);

const writePages = async (pages: RenderedStaticPage[], opts: Options): Promise<void> => {
  const { outDir = process.cwd() } = opts;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  const promises = pages.map(async (page: RenderedStaticPage) => {
    const dir = page.name === "index" ? "" : page.name;
    const filename = path.join(outDir, dir, "index.html");
    if (!fs.existsSync(path.dirname(filename))) {
      fs.mkdirSync(path.dirname(filename), { recursive: true });
    }
    return write(filename, page.html);
  });
  const errs = await Promise.all(promises);
  if (errs) {
    console.error(errs);
  }
  return Promise.resolve();
};

export { writePages };
