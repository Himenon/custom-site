import { State as AppState } from "@custom-site/internal";
import { State as PluginState } from "@custom-site/plugin";

interface State {
  [id: string]: any;
}

export class Store<U extends {}> {
  private state: State = {};
  public set<T extends keyof U>(params: { type: T; id: string; state: U[T] }): void {
    this.state[`${params.type}/${params.id}`] = params.state;
  }
  public get<T extends keyof U, S>(params: { type: T; id: string }, defaultState?: S): S extends U[T] ? U[T] : (U[T] | undefined) {
    return this.state[`${params.type}/${params.id}`] || defaultState;
  }
}

export type AppStore = Store<AppState>;
export type PluginStore = Store<PluginState>;
export const app = new Store<AppState>();
export const plugin = new Store<PluginState>();
