export type PluginName = string;
import { PageState, SiteState } from "./page";

export interface State {
  /** Return Value only Use page.metaData */
  GENERATE_META_DATA: { site: SiteState; page: PageState };
  /** Render Page converter */
  AFTER_RENDER_PAGE: { html: string };
}

export type CreateHandlerMap<T> = { [P in keyof T]?: Array<(payload: T[P]) => T[P]> };
export type CreateHandler<K extends keyof EventHandlerMap> = (payload: State[K]) => State[K];
export type EventHandlerMap = CreateHandlerMap<State>;

export interface PluginFunctionMap {
  onGenerateMetaData?: CreateHandler<"GENERATE_META_DATA">;
  onAfterRenderPage?: CreateHandler<"AFTER_RENDER_PAGE">;
}

export interface PluginDetail {
  name: PluginName;
  resolve?: string;
}

export type Plugin = PluginDetail | PluginName;
