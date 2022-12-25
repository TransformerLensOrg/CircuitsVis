import { colord, extend, AnyColor, Colord } from "colord";
import mixPlugin from "colord/plugins/mix";
import namesPlugin from "colord/plugins/names";

extend([mixPlugin, namesPlugin]);

/**
 * Get the token background color
 *
 * Defaults to color blind friendly colors (https://davidmathlogic.com/colorblind/#%23D81B60-%231E88E5-%23FFC107-%23004D40)
 */
export function getTokenBackgroundColor(
  value: number,
  min: number,
  max: number,
  negativeColor: AnyColor = "red",
  positiveColor: AnyColor = "blue"
): Colord {
  // original_color.mix("white", x) interpolates between original_color and white, with x being the ratio of white. So x=0 is original_color, x=1 is white. Clamp at 0 to avoid negative values.
  if (value > 0) {
    return colord(positiveColor).mix(colord("white"), Math.min(Math.max(1 - value / max, 0), 1));
  }

  // value and min are assumed to be negative. We negate them to be consistent with the positive case.
  return colord(negativeColor).mix(colord("white"), Math.min(Math.max(1 - (-value) / (-min), 0), 1));
}
