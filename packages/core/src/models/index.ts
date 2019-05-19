import { State as AppState } from "@custom-site/interfaces";
import { State as PluginState } from "@custom-site/interfaces/lib/plugin";

export { Model } from "./model";
import { Model } from "./model";

export type AppModel = Model<AppState>;
export type PluginModel = Model<PluginState>;
