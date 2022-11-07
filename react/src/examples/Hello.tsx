import React from "react";

/**
 * Hello Example
 */
export function Hello({
  name
}: {
  /** Name to say "Hello" to */
  name: string;
}) {
  return <p>Hello, {name}!</p>;
}
