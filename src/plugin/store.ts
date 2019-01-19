import { PageElement } from "@custom-site/page";

export interface InternalPayload {
  id: string;
}

export interface PayloadMap {
  GENERATE_PAGE: { page: PageElement };
}

export interface EventHandlerMap {
  GENERATE_PAGE: Array<(payload: PayloadMap["GENERATE_PAGE"]) => PageElement>;
}

type GetHandler<K> = K extends Array<infer R> ? R : never;

export const makeStore = (handlers: EventHandlerMap) => {
  const state: { [id: string]: any } = {};
  return {
    on<K extends keyof EventHandlerMap>(event: K, handler: GetHandler<EventHandlerMap[K]>): void {
      (handlers[event] || (handlers[event] = [])).push(handler);
    },
    emit<K extends keyof EventHandlerMap>(event: K, payload: PayloadMap[K] & InternalPayload) {
      if (handlers[event]) {
        handlers[event].forEach(handler => {
          state[payload.id] = handler(payload);
        });
      }
    },
    getState(id: string) {
      return state[id];
    },
  };
};
