import * as ReactDOM from "react-dom/server";
import { generateGoogleAnalyticsElement } from "../generateGoogleAnalyticsElement";

describe("google analytics code", () => {
  test("add no parameter", () => {
    const result = generateGoogleAnalyticsElement({});
    expect(result).toBeUndefined();
  });

  test("exist ua parameter", () => {
    const result = generateGoogleAnalyticsElement({ ua: "3141592" });
    expect(result).not.toBeUndefined();
    expect(ReactDOM.renderToStaticMarkup(result!)).toMatch(/3141592/);
  });
});
