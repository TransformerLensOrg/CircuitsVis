/* eslint-disable prefer-destructuring */
import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  browser,
  einsum,
  Rank,
  tensor,
  Tensor,
  Tensor3D,
  Tensor4D,
} from "@tensorflow/tfjs";
import tinycolor from "tinycolor2";

/**
 * Color the attention tensors
 */
export function colorAttentionTensors(
  /** Attention input as [dest_tokens x source_tokens x heads] */
  attentionInput: number[][][]
): Tensor4D {
  // Create a TensorFlow tensor from the attention data
  const attentionTensor = tensor<Rank.R3>(attentionInput); // [dest_tokens x source_tokens x heads]

  // Rearrange to [heads x dest_tokens x source_tokens]
  const attention = einsum(
    "dsh -> hds",
    attentionTensor
  ).arraySync() as number[][][];

  // Set the colors
  const colored = attention.map((head, headNumber) =>
    head.map((destination) =>
      destination.map((sourceAttention) => {
        // Color
        const attentionColor = tinycolor({
          h: (headNumber / attention.length) * 360, // Hue (degrees 0-360)
          s: 0.8, // Saturation (slightly off 100% to make less glaring)
          l: 1 - sourceAttention, // Luminance (shows amount of attention)
        });

        // Return as a nested list in the format [red, green, blue]
        const { r, g, b } = attentionColor.toRgb();
        return [r, g, b];
      })
    )
  );

  return tensor(colored);
}

/**
 * Attention Image
 *
 * Shows the attention from destination tokens to source tokens, as a [n_tokens
 * x n_tokens] image.
 */
export function AttentionImage({
  coloredAttention,
  style = {},
  isSelected = false,
}: {
  coloredAttention: Tensor3D;
  style?: CSSProperties;
  /** Adds a box-shadow to the canvas when true */
  isSelected?: boolean;
}) {
  // Add a reference to the HTML Canvas element in the DOM, so we can update it
  const canvasRef = useRef<HTMLCanvasElement>();

  // Draw the attention pattern onto the HTML Canvas
  // Runs in `useEffect` as we need the canvas to be added to the DOM first,
  // before we can interact with it.
  useEffect(() => {
    const canvas = canvasRef.current;
    browser.toPixels(coloredAttention.toInt(), canvas);
  }, [coloredAttention]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        // Set as pixelated, so that attention patterns aren't blurred
        // together.
        imageRendering: "pixelated",
        // Border
        borderColor: isSelected ? "rgba(0,0,200,0.5)" : "#DDD",
        borderStyle: "solid",
        borderWidth: 1,
        // Focussed box shadow
        boxShadow: isSelected ? "0px 0px 3px 3px rgba(0,0,200,0.4)" : null,
        // Default width
        width: 200,
        // Any other style settings
        ...style,
      }}
    />
  );
}

enum TokensView {
  DESTINATION_TO_SOURCE = "DESTINATION_TO_SOURCE",
  SOURCE_TO_DESTINATION = "SOURCE_TO_DESTINATION",
}

export function getTokensToAverage(
  meanAttentionAcrossHeads: Tensor3D,
  tokenIndex: number,
  tokensView: TokensView,
  focusedToken?: number
): Tensor3D {
  let destinationStart: number;
  let destinationEnd: number;
  let sourceStart: number;
  let sourceEnd: number;

  // If this token is selected, show the attention from the selected token to
  // this token (assuming we care about destination -> source)
  if (
    focusedToken !== null &&
    tokensView === TokensView.DESTINATION_TO_SOURCE
  ) {
    destinationStart = focusedToken;
    destinationEnd = focusedToken;
    sourceStart = tokenIndex;
    sourceEnd = tokenIndex;
  }

  // If instead we care about source -> destination,
  else if (
    focusedToken !== null &&
    tokensView === TokensView.SOURCE_TO_DESTINATION
  ) {
    destinationStart = tokenIndex;
    destinationEnd = tokenIndex;
    sourceStart = focusedToken;
    sourceEnd = focusedToken;
  }

  // If no tokens are selected, we're going to average over all source tokens
  // available to look at, i.e. up to this current token
  else {
    destinationStart = tokenIndex;
    destinationEnd = tokenIndex;
    sourceStart = 0;
    sourceEnd = tokenIndex;
  }

  return meanAttentionAcrossHeads.slice(
    [destinationStart, sourceStart],
    [destinationEnd + 1 - destinationStart, sourceEnd + 1 - sourceStart]
  );
}

/**
 * Destination token
 */
export function Token({
  focusedToken,
  focusToken,
  meanAttentionAcrossHeads,
  text,
  tokenIndex,
  tokensView,
}: {
  focusedToken?: number;
  focusToken: Dispatch<SetStateAction<number>>;
  meanAttentionAcrossHeads: Tensor3D;
  text: string;
  tokenIndex: number;
  tokensView: TokensView;
}) {
  const isFocused = focusedToken !== null && focusedToken === tokenIndex;

  // Get the average of the colors of the source tokens that we can attend to.
  const relevantTokens = getTokensToAverage(
    meanAttentionAcrossHeads,
    tokenIndex,
    tokensView,
    focusedToken
  );

  const averageColor = relevantTokens
    .mean<Tensor<Rank.R2>>(0)
    .mean<Tensor<Rank.R1>>(0);
  const [r, g, b] = averageColor.arraySync();
  const backgroundColor = tinycolor({ r, g, b });

  return (
    <button
      style={{
        backgroundColor: backgroundColor.toRgbString(),
        borderColor: "#DDD",
        borderStyle: "solid",
        borderWidth: 1,
        color: "#fff",
        display: "inline-block",
        margin: 3,
        padding: 3,
        paddingLeft: 5,
        paddingRight: 5,
        // Focussed box shadow
        boxShadow: isFocused ? "0px 0px 3px 3px rgba(0,0,200,0.4)" : null,
      }}
      onClick={() => {
        if (isFocused) {
          focusToken(null);
        } else {
          focusToken(tokenIndex);
        }
      }}
    >
      {text}
    </button>
  );
}

/**
 * Tokens
 *
 * Each token is coloured by the average of the tokens it can attend to. For
 * example, the second destination token can attend to the first two source
 * tokens only, so it will the the average of these colors.
 */
export function Tokens({
  coloredAttention,
  focusedHead,
  focusedToken,
  focusToken,
  tokens,
  tokensView,
}: {
  coloredAttention: Tensor4D;
  focusedHead?: number;
  focusedToken?: number;
  focusToken: Dispatch<SetStateAction<number>>;
  tokens: string[];
  tokensView: TokensView;
}) {
  // Just use the focused head colors if selected
  const focusedAttention =
    typeof focusedHead === "number"
      ? coloredAttention.slice([focusedHead], [1])
      : coloredAttention;

  // Get the mean attention across destination tokens
  const meanAttentionAcrossHeads = focusedAttention.mean<Tensor3D>(0); // Mean across heads

  return (
    <div>
      {tokens.map((text, tokenIndex) => (
        <Token
          focusedToken={focusedToken}
          focusToken={focusToken}
          key={tokenIndex}
          meanAttentionAcrossHeads={meanAttentionAcrossHeads}
          text={text}
          tokenIndex={tokenIndex}
          tokensView={tokensView}
        />
      ))}
    </div>
  );
}

/**
 * Attention Patterns
 */
export function AttentionPatterns({
  tokens,
  attention,
}: {
  /** Array of tokens e.g. ["Hello", "my", "name", "is"...] */
  tokens: string[];
  /** Attention input as [dest_tokens x source_tokens x heads] */
  attention: number[][][];
}) {
  // State for which head/token is focused (if any)
  const [selectedHead, selectHead] = useState<number>(null);
  const [hoveredHead, hoverHead] = useState<number>(null);
  const [selectedToken, selectToken] = useState<number>(null);
  const [tokensView, setTokensView] = useState<TokensView>(
    TokensView.DESTINATION_TO_SOURCE
  );

  // Color each attention pattern (by head)
  const coloredAttention = useMemo(
    () => colorAttentionTensors(attention),
    [attention]
  );
  const heads = coloredAttention.unstack<Tensor3D>(0);

  // Get the average attention color across all heads
  // This is helpful as we can see if, on average, only one or two colored heads
  // are focussing on a specific source token from a destination token.
  const meanAttentionAcrossHeads = coloredAttention.mean(0);

  // Set the focused head based on the state
  const focusedHead = selectedHead ?? hoveredHead ?? null;
  const focusedAttention =
    focusedHead !== null ? heads[focusedHead] : meanAttentionAcrossHeads;

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div>
          <h4>Attention Patterns</h4>
          <AttentionImage coloredAttention={focusedAttention as any} />
        </div>

        <div style={{ marginLeft: 15 }}>
          <h4>
            Head selector
            <span style={{ fontWeight: "normal" }}>
              {" "}
              (hover to focus, click to lock)
            </span>
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {heads.map((head, headNumber) => (
              <figure
                key={headNumber}
                style={{
                  margin: 0,
                  marginRight: 15,
                }}
                onClick={() => {
                  if (selectedHead === headNumber) {
                    selectHead(null);
                  } else {
                    selectHead(headNumber);
                  }
                }}
                onMouseEnter={() => {
                  hoverHead(headNumber);
                }}
                onMouseLeave={() => {
                  hoverHead(null);
                }}
              >
                <AttentionImage
                  coloredAttention={head}
                  style={{ width: 80 }}
                  isSelected={headNumber === focusedHead}
                />
                <figcaption>Head {headNumber}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="tokens">
        <h4 style={{ display: "inline-block", marginRight: 15 }}>
          Tokens
          <span style={{ fontWeight: "normal" }}> (click to focus)</span>
        </h4>
        <select
          value={tokensView}
          onChange={(e) => setTokensView(e.target.value as any)}
        >
          <option value={TokensView.DESTINATION_TO_SOURCE}>
            Source ← Destination
          </option>
          <option value={TokensView.SOURCE_TO_DESTINATION}>
            Destination ← Source
          </option>
        </select>
        <div>
          <Tokens
            coloredAttention={coloredAttention}
            focusedHead={focusedHead}
            focusedToken={selectedToken}
            focusToken={selectToken}
            tokens={tokens}
            tokensView={tokensView}
          />
        </div>
      </div>
    </div>
  );
}

export default class CustomVisualization extends HTMLElement {
  connectedCallback() {
    // Get custom element attributes
    const attributeNames = new Set(this.getAttributeNames());
    const props: any = {};
    attributeNames.forEach((attributeName) => {
      props[attributeName] = JSON.parse(this.getAttribute(attributeName));
    });

    // Setup React rendering
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);
    const root = createRoot(mountPoint);

    // Render
    root.render(<AttentionPatterns {...(props as any)} />);
  }
}
