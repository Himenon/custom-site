import { CreateHandler, EventHandlerMap, PluginEventEmitter, State } from "@custom-site/plugin";
import { pluginStore, PluginStore } from "./store";

const createPluginEventEmitter = (store: PluginStore): PluginEventEmitter => {
  const handlers: EventHandlerMap = {};
  return {
    on<K extends keyof EventHandlerMap>(event: K, handler: CreateHandler<K>): void {
      ((handlers[event] || (handlers[event] = [])) as Array<CreateHandler<K>>).push(handler);
    },
    emit<K extends keyof EventHandlerMap>(event: K, state: State[K] & { id: string }): void {
      let newState: State[K] = store.getState({ type: event, id: state.id }, state);
      ((handlers[event] || (handlers[event] = [])) as Array<CreateHandler<K>>).forEach(handler => {
        newState = handler(newState);
      });
      store.saveState({ type: event, id: state.id, state: newState });
    },
  };
};

export const pluginEventEmitter = createPluginEventEmitter(pluginStore);
