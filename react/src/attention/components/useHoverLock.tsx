import { useState } from "react";

export interface UseHoverLockState {
  focused: number;
  onClick: (element: number) => void;
  onMouseEnter: (element: number) => void;
  onMouseLeave: () => void;
}

/**
 * Track which element from a set is focussed
 *
 * Prioritizes an element being locked (clicked) rather than hovered.
 */
export function useHoverLock(
  default_locked: number | null = null
): UseHoverLockState {
  const [hoveredElement, setHoveredElement] = useState<number | null>(null);
  const [lockedElement, setLockedElement] = useState<number | null>(
    default_locked
  );

  function onClick(element: number): void {
    setLockedElement(element);
  }

  function onMouseEnter(element: number): void {
    setHoveredElement(element);
  }

  function onMouseLeave(): void {
    setHoveredElement(null);
  }

  const focused = hoveredElement ?? lockedElement;

  return {
    focused: focused as number,
    onClick,
    onMouseEnter,
    onMouseLeave
  };
}
