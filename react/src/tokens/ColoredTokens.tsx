import { AnyColor } from "colord";
import React from "react";
import { Token } from "./utils/Token";

/**
 * Display tokens with a background representing how negative (close to
 * `negativeColor`) or positive (close to `positiveColor`) the token is. Zero is
 * always displayed as white.
 */
export function ColoredTokens({
  maxValue,
  minValue,
  negativeColor,
  positiveColor,
  tokens,
  values
}: ColoredTokensProps) {
  const tokenMin = Number.isNaN(minValue) ? minValue! : Math.min(...values);
  const tokenMax = Number.isNaN(maxValue) ? maxValue! : Math.max(...values);

  return (
    <div className="colored-tokens" style={{ paddingBottom: 30 }}>
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

export interface ColoredTokensProps {
  /**
   * Maximum value
   *
   * Used to determine how dark the token color is when positive (i.e. based on
   * how close it is to the minimum value).
   *
   * @default Math.max(...values)
   */
  maxValue?: number;

  /**
   * Minimum value
   *
   * Used to determine how dark the token color is when negative (i.e. based on
   * how close it is to the minimum value).
   *
   * @default Math.min(...values)
   */
  minValue?: number;

  /**
   * Negative color
   *
   * Color to use for negative values. This can be any valid CSS color string.
   *
   * Note that only the hue and saturation are used, as the lightness is set
   * based on the value of each token.
   *
   * Be mindful of color blindness if not using the default here.
   *
   * @default "red"
   *
   * @example rgb(255, 0, 0)
   *
   * @example #ff0000
   */
  negativeColor?: AnyColor;

  /**
   * Positive color
   *
   * Color to use for positive values. This can be any valid CSS color string.
   *
   * Note that only the hue and saturation are used, as the lightness is set
   * based on the value of each token.
   *
   * Be mindful of color blindness if not using the default here.
   *
   * @default "blue"
   *
   * @example rgb(0, 0, 255)
   *
   * @example #0000ff
   */
  positiveColor?: AnyColor;

  /**
   * List of tokens
   *
   * Must be the same length as the list of values.
   */
  tokens: string[];

  /**
   * Values for each token
   *
   * Must be the same length as the list of tokens.
   */
  values: number[];
}
