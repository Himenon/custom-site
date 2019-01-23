import { State as InternalState } from "@custom-site/internal";
import { State as PluginState } from "@custom-site/plugin";

interface State {
  [id: string]: any;
}

export class Store<U extends {}> {
  private state: State = {};
  public saveState<T extends keyof U>(params: { type: T; id: string; state: U[T] }): void {
    this.state[`${params.type}/${params.id}`] = params.state;
  }
  public getState<T extends keyof U, S extends U[T]>(
    params: { type: T; id: string },
    defaultState?: S,
  ): S extends U[T] ? U[T] : (U[T] | undefined) {
    return this.state[`${params.type}/${params.id}`] || defaultState;
  }
}

export type AppStore = Store<InternalState>;
export type PluginStore = Store<PluginState>;
export const appStore = new Store<InternalState>();
export const pluginStore = new Store<PluginState>();
