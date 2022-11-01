import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { einsum, Rank, tensor, Tensor3D, Tensor4D } from "@tensorflow/tfjs";
import tinycolor from "tinycolor2";
import { AttentionImage } from "./components/AttentionImage";
import { Tokens, TokensView } from "./components/AttentionTokens";

/**
 * Color the attention values by heads
 *
 * We want attention values (re-ordered to [heads x dest_tokens x src_tokens]),
 * to be colored by each head (i.e. becoming [heads x dest_tokens x src_tokens x
 * rgb_color_channel]). This way, when outputting an image of just one attention
 * head it will be colored (by the specific hue assigned to that attention head)
 * rather than grayscale.
 *
 * Importantly, when outputting an image that averages
 * several attention heads we can then also average over the colors (so that we
 * can see for each destination-source token pair which head is most important).
 * For example, if the specific pair is very red, it suggests that the red
 * attention head is most important for this destination-source token combination.
 *
 * @param attentionInput Attention input as [dest_tokens x source_tokens x
 * heads] array (this is the format provided by the Python interface).
 *
 * @returns Tensor of the shape [heads x dest_tokens x src_tokens x
 * rgb_color_channel]
 */
export function colorAttentionTensors(attentionInput: number[][][]): Tensor4D {
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
  // State for which head/token is focused
  const [selectedHead, selectHead] = useState<number>(null);
  const [hoveredHead, hoverHead] = useState<number>(null);
  const [selectedToken, selectToken] = useState<number>(null);
  const [tokensView, setTokensView] = useState<TokensView>(
    TokensView.DESTINATION_TO_SOURCE
  );

  // Color the attention values (by head)
  const coloredAttention = useMemo(
    () => colorAttentionTensors(attention),
    [attention]
  );
  const heads = coloredAttention.unstack<Tensor3D>(0);

  // Average attention color across all heads
  // This is helpful as we can see if, on average, only one or two colored heads
  // are focussing on a specific source token from a destination token.
  const meanAttentionAcrossHeads = coloredAttention.mean(0);

  // Get the focused head based on the state (selected/hovered)
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

/**
 * Export as a custom web component
 */
export default class CustomVisualization extends HTMLElement {
  connectedCallback() {
    // Get custom element attributes
    const attributeNames = new Set(this.getAttributeNames());
    const props: any = {};
    attributeNames.forEach((attributeName) => {
      // Try to JSON parse, and if that fails assume to be a string input
      try {
        props[attributeName] = JSON.parse(this.getAttribute(attributeName));
      } catch (_e) {
        props[attributeName] = this.getAttribute(attributeName);
      }
    });

    // Setup React rendering
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);
    const root = createRoot(mountPoint);

    // Render
    root.render(<AttentionPatterns {...(props as any)} />);
  }
}
