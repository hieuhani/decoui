import { useColorScheme, useWindowDimensions } from "react-native";
import { useCallback } from "react";
import { deco } from "./deco";
import type { StyleContext } from "./style";

export const useDeco = (dependencies: (keyof StyleContext)[]) => {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  const decoFn = useCallback(
    (sx: Parameters<typeof deco>[0]) => {
      return deco(sx, {
        colorScheme: dependencies.includes("colorScheme")
          ? (colorScheme ?? undefined)
          : undefined,
        windowWidth: dependencies.includes("windowWidth") ? width : undefined,
      });
    },
    [colorScheme, width, dependencies]
  );

  return decoFn;
};
