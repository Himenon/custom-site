import { State as InternalState } from "@custom-site/internal";

interface State {
  [id: string]: any;
}

export class Store {
  private state: State = {};
  public saveState<T extends keyof InternalState>(params: { type: T; id: string; state: InternalState[T] }): void {
    this.state[`${params.type}/${params.id}`] = params.state;
  }
  public getState<T extends keyof InternalState, S extends InternalState[T]>(
    params: { type: T; id: string },
    defaultState?: S,
  ): S extends InternalState[T] ? InternalState[T] : (InternalState[T] | undefined) {
    return this.state[`${params.type}/${params.id}`] || defaultState;
  }
}

export const store = new Store();
