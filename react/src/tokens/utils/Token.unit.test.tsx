import { getTokenBackgroundColor } from "./Token";

describe("getBackgroundColor", () => {
  it("goes 100% to first color if at min", () => {
    const res = getTokenBackgroundColor(0, 0, 1, "white", "red");
    const hsl = res.toHsl();
    expect(hsl).toMatchInlineSnapshot(`
      {
        "a": 1,
        "h": 161,
        "l": 100,
        "s": 100,
      }
    `);
  });

  it("goes 100% to second color if at max", () => {
    const res = getTokenBackgroundColor(1, 0, 1, "white", "red");
    const hsl = res.toHsl();
    expect(hsl).toMatchInlineSnapshot(`
      {
        "a": 1,
        "h": 0,
        "l": 50,
        "s": 100,
      }
    `);
  });

  it("combines red and white correctly, at 80% red", () => {
    // Should be 80% red
    const res = getTokenBackgroundColor(0.8, 0, 1, "white", "red");
    const hsl = res.toHsl();
    expect(hsl).toMatchInlineSnapshot(`
      {
        "a": 1,
        "h": 11,
        "l": 61,
        "s": 100,
      }
    `);
  });
});
