import { State as InternalState } from "@custom-site/internal";
import { Store as InternalStore, store as internalStore } from "./store";

type CreateMap<T> = { [P in keyof T]?: Array<(payload: T[P]) => T[P]> };
type GetHandler<K> = K extends Array<infer R> ? R : never;
export type EventHandlerMap = CreateMap<InternalState>;

export const createStore = (iStore: InternalStore) => {
  const handlers: EventHandlerMap = {};
  return {
    on<K extends keyof EventHandlerMap>(event: K, handler: GetHandler<EventHandlerMap[K]>): void {
      // @ts-ignore TypeScriptの解析が追いついていない
      (handlers[event] || (handlers[event] = [])).push(handler);
    },
    emit<K extends keyof EventHandlerMap>(event: K, state: InternalState[K] & { id: string }): void {
      let newState = iStore.getState({ type: event, id: state.id }) || state;
      // @ts-ignore TypeScriptの解析が追いついていない
      (handlers[event] || (handlers[event] = [])).forEach(handler => {
        newState = handler(newState);
      });
      iStore.saveState({ type: event, id: state.id, state: newState });
    },
  };
};

export const store = createStore(internalStore);
