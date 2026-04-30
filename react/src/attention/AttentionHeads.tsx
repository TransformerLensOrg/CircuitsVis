import React, { useMemo, useState } from "react";
import { Col, Container, Row } from "react-grid-system";
import { AttentionPattern } from "./AttentionPattern";
import { colorAttentionTensors } from "./AttentionPatterns";
import { Tokens, TokensView } from "./components/AttentionTokens";
import { useHoverLock, UseHoverLockState } from "./components/useHoverLock";

/**
 * Attention head color
 *
 * @param idx Head index
 * @param numberOfHeads Number of heads
 * @param alpha Opaqueness (0% = fully transparent, 100% = fully opaque)
 */
export function attentionHeadColor(
  idx: number,
  numberOfHeads: number,
  alpha: string = "100%"
): string {
  const hue = Math.round((idx / numberOfHeads) * 360);

  return `hsla(${hue}, 70%, 50%,  ${alpha})`;
}

/**
 * Attention Heads Selector
 */
export function AttentionHeadsSelector({
  attention,
  attentionHeadNames,
  focused,
  maxValue,
  minValue,
  negativeColor,
  onClick,
  onMouseEnter,
  onMouseLeave,
  positiveColor,
  maskUpperTri,
  matchColor,
  tokens
}: AttentionHeadsProps & {
  attentionHeadNames: string[];
} & UseHoverLockState) {
  return (
    <Row style={{ marginBottom: 15 }}>
      {attention.map((headAttention, idx) => {
        const isFocused = focused === idx;

        return (
          <Col lg={1} md={2} xs={3} style={{ margin: 0, padding: 0 }} key={idx}>
            <div
              style={{ padding: 3 }}
              onClick={() => onClick(idx)}
              onMouseEnter={() => onMouseEnter(idx)}
              onMouseLeave={onMouseLeave}
            >
              <div
                style={{
                  position: "relative",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: attentionHeadColor(idx, attention.length),
                  boxShadow: isFocused
                    ? `0px 0px 4px 3px ${attentionHeadColor(
                        idx,
                        attention.length,
                        "60%"
                      )}`
                    : undefined
                }}
              >
                <h4
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 100,
                    margin: 0,
                    padding: 1,
                    background: attentionHeadColor(idx, attention.length),
                    color: "white"
                  }}
                >
                  {attentionHeadNames[idx]}
                </h4>

                <AttentionPattern
                  attention={headAttention}
                  tokens={tokens}
                  showAxisLabels={false}
                  maxValue={maxValue}
                  minValue={minValue}
                  negativeColor={matchColor ? undefined : negativeColor}
                  positiveColor={
                    matchColor
                      ? attentionHeadColor(idx, attention.length)
                      : positiveColor
                  }
                  maskUpperTri={maskUpperTri}
                />
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

/**
 * Attention patterns from destination to source tokens, for a group of heads.
 *
 * Displays a small heatmap for each attention head. When one is selected, it is
 * then shown in full size.
 */
export function AttentionHeads({
  attention,
  attentionHeadNames,
  maxValue,
  minValue,
  negativeColor,
  positiveColor,
  maskUpperTri = true,
  showTokens = true,
  matchColor = false,
  tokens
}: AttentionHeadsProps) {
  // Attention head focussed state
  const { focused, onClick, onMouseEnter, onMouseLeave } = useHoverLock(0);

  // State for the token view type
  const [tokensView, setTokensView] = useState<TokensView>(
    TokensView.DESTINATION_TO_SOURCE
  );

  // State for which token is focussed
  const {
    focused: focussedToken,
    onClick: onClickToken,
    onMouseEnter: onMouseEnterToken,
    onMouseLeave: onMouseLeaveToken
  } = useHoverLock();

  const headNames =
    attentionHeadNames || attention.map((_, idx) => `Head ${idx}`);

  // Color the attention values (by head) for interactive tokens
  const coloredAttention = useMemo(() => {
    if (!showTokens || !attention || attention.length === 0) return null;
    const numHeads = attention.length;
    const numDestTokens = attention[0]?.length || 0;
    const numSrcTokens = attention[0]?.[0]?.length || 0;

    if (numDestTokens === 0 || numSrcTokens === 0 || numHeads === 0)
      return null;
    return colorAttentionTensors(attention);
  }, [attention, showTokens]);

  return (
    <Container>
      <h3 style={{ marginBottom: 15 }}>
        Head Selector (hover to view, click to lock)
      </h3>

      <AttentionHeadsSelector
        attention={attention}
        attentionHeadNames={headNames}
        focused={focused}
        maxValue={maxValue}
        minValue={minValue}
        negativeColor={negativeColor}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        positiveColor={positiveColor}
        maskUpperTri={maskUpperTri}
        matchColor={matchColor}
        tokens={tokens}
      />

      <Row>
        <Col xs={12}>
          <h3 style={{ marginBottom: 10 }}>{headNames[focused]} Zoomed</h3>
          <div>
            <h2
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1000,
                margin: 6,
                padding: "5px 10px",
                background: attentionHeadColor(focused, attention.length),
                color: "white"
              }}
            >
              {headNames[focused]}
            </h2>
            <AttentionPattern
              attention={attention[focused]}
              maxValue={maxValue}
              minValue={minValue}
              negativeColor={matchColor ? undefined : negativeColor}
              positiveColor={
                matchColor
                  ? attentionHeadColor(focused, attention.length)
                  : positiveColor
              }
              zoomed={true}
              maskUpperTri={maskUpperTri}
              tokens={tokens}
            />
          </div>
        </Col>
      </Row>

      {showTokens && coloredAttention && (
        <Row>
          <Col xs={12}>
            <div className="tokens" style={{ marginTop: 20 }}>
              <h4 style={{ display: "inline-block", marginRight: 15 }}>
                Tokens
                <span style={{ fontWeight: "normal" }}> (click to focus)</span>
              </h4>
              <select
                value={tokensView}
                onChange={(e) => setTokensView(e.target.value as TokensView)}
              >
                <option value={TokensView.DESTINATION_TO_SOURCE}>
                  Source ← Destination
                </option>
                <option value={TokensView.SOURCE_TO_DESTINATION}>
                  Destination ← Source
                </option>
              </select>
              <div style={{ marginTop: 10 }}>
                <Tokens
                  coloredAttention={coloredAttention}
                  focusedHead={focused}
                  focusedToken={focussedToken}
                  onClickToken={onClickToken}
                  onMouseEnterToken={onMouseEnterToken}
                  onMouseLeaveToken={onMouseLeaveToken}
                  tokens={tokens}
                  tokensView={tokensView}
                />
              </div>
            </div>
          </Col>
        </Row>
      )}

      <Row></Row>
    </Container>
  );
}

export interface AttentionHeadsProps {
  /**
   * Attention heads activations
   *
   * Of the shape [ heads x dest_pos x src_pos ]
   */
  attention: number[][][];

  /**
   * Names for each attention head
   *
   * Useful if e.g. you want to label the heads with the layer they are from.
   */
  attentionHeadNames?: string[];

  /**
   * Maximum value
   *
   * Used to determine how dark the token color is when positive (i.e. based on
   * how close it is to the maximum value).
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
   * Be mindful of color blindness if not using the default here.
   *
   * @default red
   *
   * @example rgb(255, 0, 0)
   *
   * @example #ff0000
   */
  negativeColor?: string;

  /**
   * Positive color
   *
   * Color to use for positive values. This can be any valid CSS color string.
   *
   * Be mindful of color blindness if not using the default here.
   *
   * @default blue
   *
   * @example rgb(0, 0, 255)
   *
   * @example #0000ff
   */
  positiveColor?: string;

  /**
   * Mask upper triangular
   *
   * Whether or not to mask the upper triangular portion of the attention patterns.
   *
   * Should be true for causal attention, false for bidirectional attention.
   *
   * @default true
   */
  maskUpperTri?: boolean;

  /**
   * Show axis labels
   */
  showAxisLabels?: boolean;

  /**
   * Show interactive tokens
   *
   * Whether to show interactive token visualization where hovering over tokens shows attention strength to other tokens.
   *
   * @default true
   */
  showTokens?: boolean;

  /**
   * Match colors
   *
   * Whether to match colors between attention patterns, token visualization, and head headers for visual consistency.
   *
   * @default true
   */
  matchColor?: boolean;

  /**
   * List of tokens
   *
   * Must be the same length as the list of values.
   */
  tokens: string[];
}
