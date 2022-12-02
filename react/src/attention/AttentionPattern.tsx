import React from "react";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  ScriptableContext,
  TooltipItem,
  ChartData,
  LinearScale
} from "chart.js";
import { Chart, ChartProps } from "react-chartjs-2";
import { getTokenBackgroundColor } from "../utils/getTokenBackgroundColor";

/**
 * Register ChartJS plugins
 */
ChartJS.register(
  CategoryScale,
  Tooltip,
  MatrixElement,
  MatrixController,
  LinearScale
);

/**
 * Block data point
 *
 * Contains information about a single block on the chart.
 */
export interface Block {
  /** Source token */
  x: string;
  /** Destination token */
  y: string;
  /** Attention value */
  v: number;
}

/**
 * Attention pattern from destination to source tokens. Displays a heatmap of
 * attention values (hover to see the specific values).
 */
export function AttentionPattern({
  attention,
  maxValue = 1,
  minValue = -1,
  negativeColor,
  positiveColor,
  showAxisLabels = true,
  tokens
}: AttentionPatternProps) {
  // Tokens must be unique (for the categories), so we add an index prefix
  const uniqueTokens = tokens.map(
    (token, idx) => `(${idx}) ${token.replace(/\s/g, "")}`
  );

  // Format the chart data
  const data: ChartData<"matrix", Block[], unknown> = {
    datasets: [
      {
        // Data must be given in the form {x: xCategory, y: yCategory, v: value}
        data: attention
          .map((src, destIdx) =>
            src.map((value, srcIdx) => ({
              x: uniqueTokens[srcIdx],
              y: uniqueTokens[destIdx],
              v: value
            }))
          )
          .flat(),
        // Set the background color for each block, based on the attention value
        backgroundColor(context: ScriptableContext<"matrix">) {
          const block = context.dataset.data[context.dataIndex] as any as Block;
          const color = getTokenBackgroundColor(
            block.v,
            minValue,
            maxValue,
            negativeColor,
            positiveColor
          );
          return color.toRgbString();
        },
        // Block size
        width: (ctx) => ctx.chart.chartArea.width / tokens.length,
        height: (ctx) => ctx.chart.chartArea.height / tokens.length
      }
    ]
  };

  // Chart options
  const options: ChartProps<"matrix", Block[], unknown>["options"] = {
    plugins: {
      // Tooltip (hover) options
      tooltip: {
        callbacks: {
          title: () => "", // Hide the title
          label({ raw }: TooltipItem<"matrix">) {
            const block = raw as Block;
            return [
              `Destination: ${block.y}`,
              `Source: ${block.x}`,
              `value: ${block.v}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: "Source Token", padding: 1 },
        type: "category" as any,
        labels: uniqueTokens,
        offset: true,
        ticks: { display: true },
        grid: { display: false },
        display: showAxisLabels
      },
      y: {
        title: { display: true, text: "Destination Token", padding: 1 },
        type: "category" as any,
        offset: true,
        labels: [...uniqueTokens].reverse(),
        ticks: { display: true },
        grid: { display: false },
        display: showAxisLabels
      }
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Chart
        type="matrix"
        options={options}
        data={data}
        width={600}
        height={600}
      />
    </div>
  );
}

export interface AttentionPatternProps {
  /**
   * Attention head activations
   *
   * Of the shape [ dest_pos x src_pos ]
   */
  attention: number[][];

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
   * Show axis labels
   */
  showAxisLabels?: boolean;

  /**
   * List of tokens
   *
   * Must be the same length as the list of values.
   */
  tokens: string[];
}
