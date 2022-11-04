import { useState } from "react";

/**
 * Track which element from a set is focussed
 *
 * Prioritizes an element being locked (clicked) rather than hovered.
 */
export function useHoverLock() {
  const [hoveredElement, setHoveredElement] = useState<number>(null);
  const [lockedElement, setLockedElement] = useState<number>(null);

  function onClick(element: number): void {
    if (lockedElement === element) {
      setLockedElement(null);
    } else {
      setLockedElement(element);
    }
  }

  function onMouseEnter(element: number): void {
    setHoveredElement(element);
  }

  function onMouseLeave(): void {
    setHoveredElement(null);
  }

  const focussed = lockedElement ?? hoveredElement;

  return {
    focused: focussed,
    onClick,
    onMouseEnter,
    onMouseLeave
  };
}
