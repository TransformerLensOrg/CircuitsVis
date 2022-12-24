import React from "react";
import { colord, AnyColor } from "colord";
import { usePopperTooltip } from "react-popper-tooltip";
import { getTokenBackgroundColor } from "../../utils/getTokenBackgroundColor";
import { formatTokenText } from "./Token";

/**
 * Token (shown as an inline block)
 */
export function TokenCustomTooltip({
  token,
  value,
  min,
  max,
  negativeColor,
  positiveColor,
  tooltip = (
    <React.Fragment>
      {"Intentionally Left Blank"}
    </React.Fragment>
  )
}: {
  token: string;
  value: number;
  min: number;
  max: number;
  negativeColor?: AnyColor;
  positiveColor?: AnyColor;
  tooltip?: React.ReactNode;
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
  const tokenReplaceLineBreaks = formatTokenText(token)
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
              background: "#eee",
              color: "black",
              textAlign: "center",
              padding: 10,
              borderRadius: 5,
              boxShadow: "5px 5px rgba(0, 0, 0, 0.03)",
              marginTop: 15,
            }
          })}
        >
          {tooltip}
        </div>
      )}
    </>
  );
}
