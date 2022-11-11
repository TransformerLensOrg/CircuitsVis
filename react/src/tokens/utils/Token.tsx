import React from "react";
import { colord, extend, AnyColor, Colord } from "colord";
import mixPlugin from "colord/plugins/mix";
import namesPlugin from "colord/plugins/names";

extend([mixPlugin, namesPlugin]);

/**
 * Get the token background color
 *
 * Combines two colors based on how close a value is to the min/max of a range
 */
export function getTokenBackgroundColor(
  value: number,
  min: number,
  max: number,
  minColor: AnyColor,
  maxColor: AnyColor
): Colord {
  const minColorParsed = colord(minColor);
  const maxColorParsed = colord(maxColor);
  const portionMax = (value - min) / (max - min);
  const portionMaxBounded = Math.min(Math.max(portionMax, 0), 1);
  return minColorParsed.mix(maxColorParsed, portionMaxBounded);
}

/**
 * Token (shown as an inline block)
 */
export function Token({
  token,
  value,
  min,
  max,
  minColor,
  maxColor
}: {
  token: string;
  value: number;
  min: number;
  max: number;
  minColor: AnyColor;
  maxColor: AnyColor;
}) {
  // Get the background color
  const backgroundColor = getTokenBackgroundColor(
    value,
    min,
    max,
    minColor,
    maxColor
  ).toRgbString();

  // Get the text color
  const textColor = colord(backgroundColor).isDark() ? "white" : "black";

  const spanStyle: React.CSSProperties = {
    display: "inline-block",
    backgroundColor,
    color: textColor,
    lineHeight: "1em",
    padding: "3px 0",
    marginLeft: -1,
    marginBottom: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#eee"
  };

  // Spaces are encoded as the HTML space tag
  const tokenReplaceSpaces = token.replace(/\s/g, "&nbsp;");

  // Handle line breaks
  // Add a new line symbol and then replace new lines with a <br> tag
  if (token.includes("\n")) {
    const tokenReplaceLineBreaks = token.replace(/\n/g, "¶");
    const lineBreakElements = token.match(/\n/g)!;

    return (
      <>
        <span
          style={{ ...spanStyle, color: "#ddd" }}
          dangerouslySetInnerHTML={{ __html: tokenReplaceLineBreaks }}
        ></span>
        {lineBreakElements.map((_break, idx) => (
          <br key={idx} />
        ))}
      </>
    );
  }

  return (
    <>
      <span data-tip="hello world">
        <span
          style={spanStyle}
          dangerouslySetInnerHTML={{ __html: tokenReplaceSpaces }}
        ></span>
      </span>
    </>
  );
}
