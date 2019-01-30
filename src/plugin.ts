import { CreateHandler, EventHandlerMap, State } from "@custom-site/plugin";
import { plugin, PluginStore } from "./store";

const createPluginEventEmitter = (store: PluginStore) => {
  const handlers: EventHandlerMap = {};
  return {
    on<K extends keyof EventHandlerMap>(event: K, handler?: CreateHandler<K>): void {
      if (handler) {
        ((handlers[event] || (handlers[event] = [])) as Array<CreateHandler<K>>).push(handler);
      }
    },
    emit<K extends keyof EventHandlerMap>(event: K, state: State[K] & { id: string }): void {
      let newState: State[K] = state;
      ((handlers[event] || (handlers[event] = [])) as Array<CreateHandler<K>>).forEach(handler => {
        newState = handler(newState);
      });
      store.set({ type: event, id: state.id, state: newState });
    },
    clearAll(): void {
      Object.keys(handlers).forEach(key => (handlers[key] = []));
    },
  };
};

export const pluginEventEmitter = createPluginEventEmitter(plugin);
