import React, { CSSProperties, useEffect, useRef } from "react";
import { browser, Tensor3D } from "@tensorflow/tfjs";

export interface AttentionImageProps {
  /**
   * Attention patterns (destination to source tokens), colored by attention head
   *
   * Should be [n_tokens x n_tokens x color_channels]
   */
  coloredAttention: Tensor3D;

  style?: CSSProperties;

  /** Adds a box-shadow to the canvas when true */
  isSelected?: boolean;
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
}: AttentionImageProps) {
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
