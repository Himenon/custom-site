import { pluginEventEmitter } from "../lifeCycle";
import { render } from "../renderer";
import { pageStateExamples, siteStateExample } from "./ExampleSiteParameters";

describe("render test", () => {
  test("no pages", async done => {
    const pages = await render(siteStateExample, []);
    expect(pages.length).toBe(0);
    done();
  });

  test("sample page", async done => {
    const pages = await render(siteStateExample, [pageStateExamples[0]]);
    expect(pages.length).toBe(1);
    expect(pages[0].html).toMatch(/<title>test page title a<\/title>/);
    expect(pages[0].html).toMatch(/<meta charSet="utf-8"\/>/);
    expect(pages[0].html).toMatch(/<head lang="en">/);
    expect(pages[0].html).toMatch(/<body><div><p>test page a<\/p><\/div><\/body>/);
    done();
  });

  test("meta plugin", async done => {
    pluginEventEmitter.on("GENERATE_META_DATA", payload => {
      payload.page.metaData.extend = {
        meta: [
          {
            property: "og:title",
            content: payload.page.metaData.title,
          },
          {
            name: "twitter:site",
            content: "@twitter",
          },
        ],
      };
      return payload;
    });
    const pages = await render(siteStateExample, [pageStateExamples[1]]);
    expect(pages.length).toBe(1);
    expect(pages[0].html).toMatch(/og:title/);
    expect(pages[0].html).toMatch(/twitter:site/);
    done();
  });

  test("empty plugin", async done => {
    pluginEventEmitter.on("AFTER_RENDER_PAGE", _payload => {
      return { html: "rewrite result" };
    });
    const pages = await render(siteStateExample, [pageStateExamples[1]]);
    expect(pages.length).toBe(1);
    expect(pages[0].html).toBe("rewrite result");
    done();
  });
});
