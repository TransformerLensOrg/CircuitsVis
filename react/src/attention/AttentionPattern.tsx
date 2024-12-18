import React, { useMemo } from "react";
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
import { Col, Row } from "react-grid-system";
import { colord } from "colord";
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
  /** Source token with index suffix */
  x: string;
  /** Destination token with index suffix */
  y: string;
  /** Attention value */
  v: number;
  /** Source token */
  srcToken: string;
  /** Destination token */
  destToken: string;
  /** Source index */
  srcIdx: number;
  /** Destination index */
  destIdx: number;
}

const DefaultUpperTriColor = "rgb(200,200,200)";

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
  upperTriColor = DefaultUpperTriColor,
  showAxisLabels = true,
  zoomed = false,
  maskUpperTri = true,
  tokens
}: AttentionPatternProps) {
  // Tokens must be unique (for the categories), so we add an index prefix
  const uniqueTokens = useMemo(
    () => tokens.map((token, idx) => `${token.replace(/\s/g, "")} (${idx})`),
    [tokens]
  );

  // Memoize the chart data
  const chartData = useMemo(() => {
    return attention
      .map((src, destIdx) =>
        src.map((value, srcIdx) => ({
          srcIdx,
          destIdx,
          srcToken: tokens[srcIdx],
          destToken: tokens[destIdx],
          x: uniqueTokens[srcIdx],
          y: uniqueTokens[destIdx],
          v: value
        }))
      )
      .flat();
  }, [attention, tokens, uniqueTokens]);

  // Format the chart data
  const data: ChartData<"matrix", Block[], unknown> = {
    datasets: [
      {
        // Data must be given in the form {x: xCategory, y: yCategory, v: value}
        data: chartData,
        // Set the background color for each block, based on the attention value
        backgroundColor(context: ScriptableContext<"matrix">) {
          const block = context.dataset.data[context.dataIndex] as any as Block;
          if (maskUpperTri && block.srcIdx > block.destIdx) {
            // Color the upper triangular part separately
            return colord(upperTriColor).toRgbString();
          }
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
    animation: {
      duration: 0 // general animation time
    },
    plugins: {
      // Tooltip (hover) options
      tooltip: {
        enabled: showAxisLabels,
        yAlign: "bottom",
        callbacks: {
          title: () => "", // Hide the title
          label({ raw }: TooltipItem<"matrix">) {
            const block = raw as Block;
            if (maskUpperTri && block.destIdx < block.srcIdx) {
              // Just show N/A for the upper triangular part
              return "N/A";
            }
            return [
              `(${block.destIdx}, ${block.srcIdx})`,
              `Src: ${block.srcToken}`,
              `Dest: ${block.destToken} `,
              `Val: ${block.v}`
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
        ticks: { display: true, minRotation: 45, maxRotation: 90 },
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
    <Col>
      <Row>
        <div
          style={{
            // Chart.js charts resizing is weird.
            // Responsive chart elements (which all are by default) require the
            // parent element to have position: 'relative' and no sibling elements.
            // There were previously issues that only occured at particular display
            // sizes and zoom levels. See:
            // https://github.com/TransformerLensOrg/CircuitsVis/pull/63
            // https://www.chartjs.org/docs/latest/configuration/responsive.html#important-note
            // https://stackoverflow.com/a/48770978/7086623
            position: "relative",
            // Set the maximum width of zoomed heads such that a head with just a
            // few tokens doesn't have crazy large boxes per token and the chart
            // doesn't overflow the screen. Other heads fill their width.
            maxWidth: zoomed
              ? `min(100%, ${Math.round(tokens.length * 8)}em)`
              : "initial",
            width: zoomed ? "initial" : "100%",
            aspectRatio: "1/1"
          }}
        >
          <Chart
            type="matrix"
            options={options}
            data={data}
            width={1000}
            height={1000}
            updateMode="none"
          />
        </div>
      </Row>
    </Col>
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
   * Upper triangular color
   *
   * Color to use for the upper triangular part of the attention pattern to make visualization slightly nicer.
   * Only applied if maskUpperTri is set to true.
   *
   * @default rgb(200, 200, 200)
   *
   * @example rgb(200, 200, 200)
   *
   * @example #C8C8C8
   */
  upperTriColor?: string;

  /**
   * Show axis labels
   */
  showAxisLabels?: boolean;

  /**
   * Is this a zoomed in view?
   */
  zoomed?: boolean;

  /**
   * List of tokens
   *
   * Must be the same length as the list of values.
   */
  tokens: string[];
}
