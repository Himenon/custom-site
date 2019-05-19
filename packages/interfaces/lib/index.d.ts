import { FileWatchFlag } from "./development";
import { HtmlMetaData } from "./page";
import { Plugin } from "./plugin";

export interface CommonOption {
  /**
   * `config.json`のパス
   */
  configFile?: string;
  /**
   * 記事のソースファイルがあるディレクトリ
   * configFileからの相対パス
   */
  source: string;
  global: HtmlMetaData;
  destination?: string;
  baseUri: string;
  baseUrl: string;
  port: number;
  blacklist: {
    extensions: string[];
  };
  layoutFile?: string;
  customComponentsFile?: string;
  plugins: Plugin[];
  __type?: "PRODUCTION" | "DEVELOPMENT";
}

/**
 * optionalのみの追加を認める
 */
export interface DevelopOption extends CommonOption {
  __type: "DEVELOPMENT";
  watcher?: FileWatchFlag;
  open?: boolean;
}

/**
 * optionalのみの追加を認める
 */
export interface BuildOption extends CommonOption {
  __type: "PRODUCTION";
  destination: string;
}

export interface Options {
  develop?: DevelopOption;
  build?: BuildOption;
}
