import { State as AppState } from "@custom-site/internal";
import { State as PluginState } from "@custom-site/plugin";

export { Model } from "./model";
import { Model } from "./model";

export type AppModel = Model<AppState>;
export type PluginModel = Model<PluginState>;
