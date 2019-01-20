import { State as InternalState } from "@custom-site/internal";
import { Store as InternalStore, store as internalStore } from "./store";

type CreateHandlerMap<T> = { [P in keyof T]?: Array<(payload: T[P]) => T[P]> };
type CreateHandler<K extends keyof EventHandlerMap> = (payload: InternalState[K]) => InternalState[K];
type EventHandlerMap = CreateHandlerMap<InternalState>;

export const createStore = (iStore: InternalStore) => {
  const handlers: EventHandlerMap = {};
  return {
    on<K extends keyof EventHandlerMap>(event: K, handler: CreateHandler<K>): void {
      ((handlers[event] || (handlers[event] = [])) as Array<CreateHandler<K>>).push(handler);
    },
    emit<K extends keyof EventHandlerMap>(event: K, state: InternalState[K] & { id: string }): void {
      let newState = iStore.getState({ type: event, id: state.id }) || state;
      ((handlers[event] || (handlers[event] = [])) as Array<CreateHandler<K>>).forEach(handler => {
        newState = handler(newState);
      });
      iStore.saveState({ type: event, id: state.id, state: newState });
    },
  };
};

export const store = createStore(internalStore);
