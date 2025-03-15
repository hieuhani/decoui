import { useColorScheme, useWindowDimensions } from "react-native";
import { useMemo } from "react";
import { deco } from "./deco";
import type { StyleContext } from "./style";

export const useDeco = (dependencies: (keyof StyleContext)[]) => {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  return useMemo(
    () => (sx: Parameters<typeof deco>[0]) =>
      deco(sx, {
        colorScheme: colorScheme ?? undefined,
        windowWidth: width,
      }),
    [
      ...(dependencies.includes("colorScheme") ? [colorScheme] : []),
      ...(dependencies.includes("windowWidth") ? [width] : []),
    ]
  );
};
