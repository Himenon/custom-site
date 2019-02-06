jest.mock("fs");
jest.mock("recursive-readdir");
jest.mock("../resolver");

let recursive: () => Promise<string[]> = async () => [];
jest.setMock("recursive-readdir", () => recursive());

import { generateStaticPages } from "../generator";
import { defaultConfig } from "./ExampleSiteParameters";

describe("generator test", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("generateStaticPages", async done => {
    recursive = async () => [];
    const pages = await generateStaticPages(defaultConfig);
    expect(pages.length).toBe(0);
    done();
  });

  it("can load '.mdx' extension", async done => {
    recursive = async () => ["a.mdx", "b.mdx"];
    const pages = await generateStaticPages(defaultConfig);
    expect(pages.length).toBe(2);
    done();
  });

  it("load target extensions are .jsx .mdx .md", async done => {
    recursive = async () => ["a.jsx", "b.mdx", "c.jsx"];
    const pages = await generateStaticPages(defaultConfig);
    expect(pages.length).toBe(3);
    done();
  });
});
