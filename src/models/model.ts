interface State {
  [id: string]: any;
}

/**
 * TODO clear
 */
export class Model<U extends {}> {
  private state: State = {};
  public set<T extends keyof U>(params: { type: T; id: string; state: U[T] }): void {
    this.state[`${params.type}/${params.id}`] = params.state;
  }
  public get<T extends keyof U, S>(params: { type: T; id: string }, defaultState?: S): S extends U[T] ? U[T] : (U[T] | undefined) {
    return this.state[`${params.type}/${params.id}`] || defaultState;
  }
}
