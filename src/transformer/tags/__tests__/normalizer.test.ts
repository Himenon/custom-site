jest.unmock("../normalizer");
import { normalizerSourcePath } from "../normalizer";

describe("Generate Script Tag", () => {
  test("normalize source path", () => {
    expect(normalizerSourcePath("./a/b/c", true)).toBe("./a/b/c");
    expect(normalizerSourcePath("./a/b/c", false)).toBe("/a/b/c");
    expect(normalizerSourcePath("/a/b/c", true)).toBe("./a/b/c");
    expect(normalizerSourcePath("/a/b/c", false)).toBe("/a/b/c");
    expect(normalizerSourcePath("a/b/c", true)).toBe("./a/b/c");
    expect(normalizerSourcePath("a/b/c", false)).toBe("/a/b/c");
    expect(normalizerSourcePath("http://a/b/c", true)).toBe("http://a/b/c");
    expect(normalizerSourcePath("http://a/b/c", false)).toBe("http://a/b/c");
    expect(normalizerSourcePath("https://a/b/c", true)).toBe("https://a/b/c");
    expect(normalizerSourcePath("https://a/b/c", false)).toBe("https://a/b/c");
  });
});
