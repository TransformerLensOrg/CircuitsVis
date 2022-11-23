import { colord } from "colord";
import { getTokenBackgroundColor } from "../getTokenBackgroundColor";

describe("getBackgroundColor", () => {
  it("sets a positive color to blue", () => {
    const res = getTokenBackgroundColor(1, -1, 1);
    const hsl = res.toHsl();
    const greenHue = colord("blue").toHsv().h;
    expect(hsl.h).toBeCloseTo(greenHue);
  });

  it("sets a negative color to red", () => {
    const res = getTokenBackgroundColor(-1, -1, 1);
    const hsl = res.toHsl();
    const blueHue = colord("red").toHsv().h;
    expect(hsl.h).toBeCloseTo(blueHue);
  });

  it("sets 0 to white", () => {
    // Should be 80% red
    const res = getTokenBackgroundColor(0, -1, 1);
    const hsl = res.toHsl();
    expect(hsl.l).toBeCloseTo(100);
  });
});
