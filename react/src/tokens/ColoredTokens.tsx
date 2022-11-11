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
  minColor,
  maxColor
}: {
  tokens: string[];
  values: number[];
  minValue?: number;
  maxValue?: number;
  minColor?: AnyColor;
  maxColor?: AnyColor;
}) {
  const tokenMin = Number.isNaN(minValue) ? Math.min(...values) : minValue!;
  const tokenMax = Number.isNaN(maxValue) ? Math.min(...values) : maxValue!;

  return (
    <div className="colored-tokens">
      {tokens.map((token, key) => (
        <Token
          key={key}
          token={token}
          value={values[key]}
          min={tokenMin}
          max={tokenMax}
          minColor={minColor || "white"}
          maxColor={maxColor || "red"}
        />
      ))}
    </div>
  );
}
