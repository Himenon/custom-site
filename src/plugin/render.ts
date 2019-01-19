import { PageElement } from "@custom-site/page";
import { pluginStore } from "./store";

export const generatePageProps = (payload: { page: PageElement }) => {
  pluginStore.emit("GENERATE_PAGE", payload);
};
