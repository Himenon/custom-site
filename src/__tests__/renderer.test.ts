import { pluginEventEmitter } from "../plugin";
import { render } from "../renderer";
import { pageStateExamples, siteStateExample } from "./SiteExample";

describe("render test", () => {
  test("no pages", async done => {
    const pages = await render(siteStateExample, []);
    expect(pages.length).toBe(0);
    done();
  });

  test("sample page", async done => {
    const pages = await render(siteStateExample, [pageStateExamples[0]]);
    expect(pages.length).toBe(1);
    expect(pages[0].html).toBe(
      // tslint:disable-next-line:max-line-length
      '<html><head lang="en"><title>test page title a</title><meta charSet="utf-8"/></head><body><div><p>test page a</p></div></body></html>',
    );
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
