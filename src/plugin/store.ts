import { EventEmitter } from "events";

export const pluginStore = new class PluginStore extends EventEmitter {}();
