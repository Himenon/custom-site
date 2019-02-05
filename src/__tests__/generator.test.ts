import { generateStaticPages } from "../generator";
import { defaultConfig } from "./ExampleSiteParameters";

describe("generator test", () => {
  it("generateStaticPages", async done => {
    const pages = await generateStaticPages(defaultConfig);
    expect(pages.length).toBe(5);
    done();
  });
});
