import { useColorScheme, useWindowDimensions } from "react-native";
import { useCallback } from "react";
import { deco } from "./deco";
import type { StyleContext } from "./style";

export const useDeco = (dependencies: (keyof StyleContext)[]) => {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  const deps: unknown[] = [];
  if (dependencies.includes("colorScheme")) {
    deps.push(colorScheme);
  }
  if (dependencies.includes("windowWidth")) {
    deps.push(width);
  }

  const decoFn = useCallback((sx: Parameters<typeof deco>[0]) => {
    return deco(sx, {
      colorScheme: colorScheme ?? undefined,
      windowWidth: width,
    });
  }, deps);

  return decoFn;
};
