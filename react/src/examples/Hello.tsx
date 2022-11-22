import React from "react";

/**
 * Example component that says "Hello" to the given name.
 */
export function Hello({ name }: HelloProps) {
  return <p>Hello, {name}!</p>;
}

export interface HelloProps {
  /**
   * Name to say "Hello" to
   */
  name: string;
}
