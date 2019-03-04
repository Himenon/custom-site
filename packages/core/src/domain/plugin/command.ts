import { State as PluginState } from "@custom-site/plugin";
import { PluginModel } from "../../models";

export class CommandService {
  public static readonly ID = "";
  constructor(private readonly model: PluginModel) {}

  public savePlugin<T extends keyof PluginState>(params: { type: T; id: string; state: PluginState[T] }) {
    this.model.set(params);
  }
}
