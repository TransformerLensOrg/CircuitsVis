import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { useHoverLock } from "../useHoverLock";

it("starts without focus", () => {
  const { result } = renderHook(() => useHoverLock());

  expect(result.current.focused).toBe(null);
});

describe("click", () => {
  it("focusses if clicked", () => {
    const { result } = renderHook(() => useHoverLock());

    act(() => {
      result.current.onClick(1);
    });

    expect(result.current.focused).toBe(1);
  });
});

describe("hover", () => {
  it("focusses if hovered", () => {
    const { result } = renderHook(() => useHoverLock());

    act(() => {
      result.current.onMouseEnter(1);
    });

    expect(result.current.focused).toBe(1);
  });

  it("removes focus if no longer hovered", () => {
    const { result } = renderHook(() => useHoverLock());

    act(() => {
      result.current.onMouseEnter(1);
      result.current.onMouseLeave();
    });

    expect(result.current.focused).toBe(null);
  });
});

describe("prioritization", () => {
  it("prioritizes hover over lock (click)", () => {
    const { result } = renderHook(() => useHoverLock());

    act(() => {
      result.current.onMouseEnter(1);
      result.current.onClick(2);
      result.current.onMouseEnter(3);
    });

    expect(result.current.focused).toBe(3);
  });
});
