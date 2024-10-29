import { test, expect, vi, describe } from "vitest";
import { createTokens } from "../tokens";
import { PixelRatio, Platform } from "react-native";

describe("token", () => {
  test("createTheme for the web platform", () => {
    vi.spyOn(Platform, "OS", "get").mockReturnValue("web");
    const tokens = createTokens();
    expect(tokens.spacing["0"]).toBe("0");
    expect(tokens.spacing["0.5"]).toBe("0.125rem");
  });

  test("createTheme for native platform should respect device font scale", () => {
    vi.spyOn(Platform, "OS", "get").mockReturnValue("ios");
    vi.spyOn(PixelRatio, "getFontScale").mockReturnValue(1);
    const tokens = createTokens();
    expect(tokens.spacing["0"]).toBe(0);
    expect(tokens.spacing["0.5"]).toBe(1.5);
    expect(tokens.spacing["2"]).toBe(6);
    expect(tokens.spacing["4"]).toBe(12);

    expect(tokens.fontSize["2xl"].lineHeight).toBe(2);
    expect(tokens.fontSize["2xl"].fontSize).toBe(18);
    expect(tokens.borderRadius["2xl"]).toBe(12);
    expect(tokens.borderRadius.none).toBe(0);
    expect(tokens.borderRadius.full).toBe(9999);
  });
});
