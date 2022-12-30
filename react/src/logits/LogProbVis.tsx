import React from "react";
import { colord, extend, AnyColor } from "colord";
import mixPlugin from "colord/plugins/mix";
import namesPlugin from "colord/plugins/names";
import { TokenCustomTooltip } from "../tokens/utils/TokenCustomTooltip";
import { formatTokenText } from "../tokens/utils/Token";

extend([mixPlugin, namesPlugin]);

const maxLogProb = 5;

export function logProbToColor(
  logProb: number,
  color: AnyColor = "blue",
  min: number = -maxLogProb
) {
  return colord(color).mix(colord("grey"), Math.min(-logProb / -min, 1.0));
}

export function SimpleToken({ token }: { token: string }) {
  return (
    <span
      style={{ borderColor: "green", borderWidth: 1, borderStyle: "solid" }}
      dangerouslySetInnerHTML={{ __html: formatTokenText(token) }}
    />
  );
}

export function TooltipTableRow({
  token,
  logProb,
  rank,
  isCorrectToken
}: {
  token: string;
  logProb: number;
  rank: number;
  isCorrectToken: boolean;
}) {
  const correctTokenStyle: React.CSSProperties = {
    color: "orange",
    backgroundColor: logProbToColor(logProb).toRgbString(),
    fontWeight: "bold"
  };

  const incorrectTokenStyle: React.CSSProperties = {
    color: "white",
    backgroundColor: logProbToColor(logProb).toRgbString()
  };

  return (
    <tr style={isCorrectToken ? correctTokenStyle : incorrectTokenStyle}>
      <td>#{rank}</td>
      <td>{(Math.exp(logProb) * 100).toFixed(2)}%</td>
      <td>{logProb.toFixed(3)}</td>
      <td>
        <SimpleToken token={token} />
      </td>
    </tr>
  );
}

export function Tooltip({
  currentCorrectToken,
  currentCorrectTokenRank,
  currentCorrectTokenLogProb,
  currentTopKLogProbs,
  currentTopKTokens,
  prevToken
}: {
  currentCorrectToken: string;
  currentCorrectTokenRank: number;
  currentCorrectTokenLogProb: number;
  currentTopKLogProbs: number[];
  currentTopKTokens: string[];
  prevToken: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 20,
          fontWeight: "bold",
          backgroundColor: "white",
          color: "black"
        }}
      >
        <SimpleToken token={prevToken}></SimpleToken> -{">"}{" "}
        <SimpleToken token={currentCorrectToken} />
      </div>
      <table>
        <tr>
          <th>Rank</th>
          <th>Prob</th>
          <th>Log Prob</th>
          <th>String</th>
        </tr>
        <TooltipTableRow
          token={currentCorrectToken}
          logProb={currentCorrectTokenLogProb}
          rank={currentCorrectTokenRank}
          isCorrectToken={true}
        />
        <hr />
        {/* currentTopKTokens.map is used in because JavaScript doesn't have range(n). The token is ignored. */}
        {currentTopKTokens.map((_token, i) => (
          <TooltipTableRow
            key={i}
            token={currentTopKTokens[i]}
            logProb={currentTopKLogProbs[i]}
            rank={i}
            isCorrectToken={currentCorrectTokenRank === i}
          />
        ))}
      </table>
    </div>
  );
}

export function LogProbVis({
  prompt,
  topKLogProbs,
  topKTokens,
  correctTokenRank,
  correctTokenLogProb
}: LogProbVisProps) {
  return (
    // Padding to ensure that the tooltip is visible - pretty janky, sorry!
    <div style={{ paddingBottom: 350 }}>
      {prompt.slice(1).map((token, i) => (
        <TokenCustomTooltip
          key={i}
          token={token}
          value={Math.max(maxLogProb + correctTokenLogProb[i], 0)}
          min={-0.1}
          max={maxLogProb}
          positiveColor="red"
          tooltip={
            <Tooltip
              currentCorrectToken={token}
              currentCorrectTokenRank={correctTokenRank[i]}
              currentCorrectTokenLogProb={correctTokenLogProb[i]}
              currentTopKLogProbs={topKLogProbs[i]}
              currentTopKTokens={topKTokens[i]}
              prevToken={prompt[i]}
            />
          }
        />
      ))}
    </div>
  );
}

export interface LogProbVisProps {
  prompt: string[];
  /**
   */
  topKLogProbs: number[][];
  /**
   */
  topKTokens: string[][];
  /**
   */
  correctTokenRank: number[];
  /**
   */
  correctTokenLogProb: number[];
}
