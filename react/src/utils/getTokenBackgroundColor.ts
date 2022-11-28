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
  if (value > 0) {
    return colord(positiveColor).mix(colord("white"), 1 - value / max);
  }

  return colord(negativeColor).mix(colord("white"), 1 - value / min);
}
