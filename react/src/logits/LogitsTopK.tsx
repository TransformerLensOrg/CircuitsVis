import React from "react";

/**
 * Display all tokens in the prompt, and show the top 'k' expected tokens when
 * you hover over a specific token.
 */
export function LogitsTopK({ tokens }: LogitsTopKProps) {
  return (
    <div className="colored-tokens" style={{ paddingBottom: 30 }}>
      {tokens.map((token, key) => (
        <span key={key}>{token.token}</span>
      ))}
    </div>
  );
}

export interface LogitDetails {
  logit: number;
  nextToken: string;
  probability: number;
  logProbability: number;
  rank: number;
}

export interface LogitsTopKProps {
  tokens: Array<{
    token: string;
    topKNextTokens: Array<LogitDetails>;
    correctNextToken: LogitDetails;
  }>;
}
