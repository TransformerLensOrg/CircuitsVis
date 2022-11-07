import React, { useState } from "react";

/**
 * Hello Example
 */
export function Hello({
  name
}: {
  /** Name to say "Hello" to */
  name: string;
}) {
  const [state, setState] = useState<number>(1);

  console.log(state, typeof setState);

  return <p>Hello, {name}!</p>;
}
