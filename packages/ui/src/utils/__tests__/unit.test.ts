import { test, expect, describe } from "vitest";

import { remToPtRaw, remToPt } from "../unit";

describe("convert rem to pt when base font size is 16px", () => {
  test("without unit 1rem = 12pt", () => {
    expect(remToPtRaw(1)).toBe(12);
  });

  test("1rem = 12pt", () => {
    expect(remToPt("1rem")).toBe(12);
  });

  test("-1rem = -12pt", () => {
    expect(remToPt("-1rem")).toBe(-12);
  });

  test("invalid rem unit 1ch throw error", () => {
    expect(() => remToPt("1ch")).toThrowError(/Invalid rem unit/);
  });

  test("invalid rem value NotANumber rem throw error", () => {
    expect(() => remToPt("NotANumber rem")).toThrowError(/Invalid rem value/);
  });
});
