import { AnyColor } from "colord";
import React from "react";
import { Token } from "./utils/Token";

/**
 * Colored tokens
 *
 * Displays tokens with background colors blended from a "minColor" to a
 * "maxColor".
 */
export function ColoredTokens({
  tokens,
  values,
  minValue,
  maxValue,
  negativeColor,
  positiveColor
}: {
  tokens: string[];
  values: number[];
  minValue?: number;
  maxValue?: number;
  negativeColor?: AnyColor;
  positiveColor?: AnyColor;
}) {
  const tokenMin = Number.isNaN(minValue) ? minValue! : Math.min(...values);
  const tokenMax = Number.isNaN(maxValue) ? maxValue! : Math.max(...values);

  return (
    <div className="colored-tokens">
      {tokens.map((token, key) => (
        <Token
          key={key}
          token={token}
          value={values[key]}
          min={tokenMin}
          max={tokenMax}
          negativeColor={negativeColor}
          positiveColor={positiveColor}
        />
      ))}
    </div>
  );
}
