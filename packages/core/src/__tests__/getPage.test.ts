jest.unmock("../getPage");
import { isStartWithHttp } from "../getPage";

describe("getPage test", () => {
  test("isStartWithHttp", () => {
    expect(isStartWithHttp("//example.com")).toBe(true);
    expect(isStartWithHttp("http://example.com")).toBe(true);
    expect(isStartWithHttp("https://example.com")).toBe(true);
    expect(isStartWithHttp("/example.com")).toBe(false);
    expect(isStartWithHttp("http//example.com")).toBe(false);
    expect(isStartWithHttp("https//example.com")).toBe(false);
    expect(isStartWithHttp("http/example.com")).toBe(false);
    expect(isStartWithHttp("https/example.com")).toBe(false);
  });
});
