import { useState } from "react";

/**
 * Track which element from a set is focussed
 *
 * Prioritizes an element being locked (clicked) rather than hovered.
 */
export function useHoverLock(): {
  focused: number;
  onClick: (element: number) => void;
  onMouseEnter: (element: number) => void;
  onMouseLeave: () => void;
} {
  const [hoveredElement, setHoveredElement] = useState<number | null>(null);
  const [lockedElement, setLockedElement] = useState<number | null>(null);

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

  const focused = lockedElement ?? hoveredElement;

  return {
    focused: focused as number,
    onClick,
    onMouseEnter,
    onMouseLeave
  };
}
