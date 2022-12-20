import React from "react";
import { colord, AnyColor } from "colord";
import { usePopperTooltip } from "react-popper-tooltip";
import { getTokenBackgroundColor } from "../../utils/getTokenBackgroundColor";

/**
 * Token (shown as an inline block)
 */
export function Token({
  token,
  value,
  min,
  max,
  negativeColor,
  positiveColor
}: {
  token: string;
  value: number;
  min: number;
  max: number;
  negativeColor?: AnyColor;
  positiveColor?: AnyColor;
}) {
  // Hover state
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      followCursor: true
    });

  // Get the background color
  const backgroundColor = getTokenBackgroundColor(
    value,
    min,
    max,
    negativeColor,
    positiveColor
  ).toRgbString();

  // Get the text color
  const textColor =
    colord(backgroundColor).brightness() < 0.6 ? "white" : "black";

  // Format the span (CSS style)
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

  // Handle special tokens (e.g. spaces/line breaks)
  const tokenReplaceSpaces = token.replace(/\s/g, "&nbsp;");
  const tokenReplaceLineBreaks = tokenReplaceSpaces.replace(/\n/g, "¶");
  const lineBreakElements = token.match(/\n/g)!;

  return (
    <>
      <span ref={setTriggerRef}>
        <span
          style={spanStyle}
          dangerouslySetInnerHTML={{ __html: tokenReplaceLineBreaks }}
        ></span>
        {lineBreakElements?.map((_break, idx) => (
          <br key={idx} />
        ))}
      </span>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            style: {
              background: "#333",
              color: "white",
              textAlign: "center",
              padding: 10,
              borderRadius: 5,
              boxShadow: "5px 5px rgba(0, 0, 0, 0.03)",
              marginTop: 15,
              zIndex: 1
            }
          })}
        >
          <strong>{token}</strong>
          <br />
          {value}
        </div>
      )}
    </>
  );
}
