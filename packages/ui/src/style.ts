import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { tokens } from "./theme";
import { normalizeUnit } from "./utils/unit";
import { styleAttributes } from "./internal/rn-style-attributes";
import type { PossibleColorToken } from "./tokens";
import type { ViewStyle as ExpoViewStyle } from "@expo/html-elements/build/primitives/View";

const groupModifiers = {
  minWidth: ["sm", "md", "lg", "xl", "2xl"],
  maxWidth: ["max-sm", "max-md", "max-lg", "max-xl", "max-2xl"],
  colorScheme: ["light", "dark"],
  elementState: ["hover", "focus", "active", "disabled"],
} as const;

const modifierGroupMap = Object.entries(groupModifiers).reduce<{
  [key: string]: string;
}>((acc, [group, modifiers]) => {
  modifiers.forEach((modifier) => {
    acc[modifier] = group;
  });
  return acc;
}, {});

type MinWidthBreakpoint = (typeof groupModifiers.minWidth)[number];
type MaxWidthBreakpoint = (typeof groupModifiers.maxWidth)[number];
type ColorScheme = (typeof groupModifiers.colorScheme)[number];
type ElementState = (typeof groupModifiers.elementState)[number];

type WithDesignToken<S> =
  S extends StyleProp<TextStyle>
    ? {
        color?: PossibleColorToken;
      } & S
    : S extends StyleProp<ExpoViewStyle>
      ? {
          backgroundColor?: PossibleColorToken;
        } & S
      : S;

export type DecoStyle<S> = {
  [K in
    | MinWidthBreakpoint
    | MaxWidthBreakpoint
    | ColorScheme
    | ElementState
    | `${MinWidthBreakpoint}:${MaxWidthBreakpoint}`
    | `${MinWidthBreakpoint}:${ColorScheme}`
    | `${MinWidthBreakpoint}:${ElementState}`
    | `${MaxWidthBreakpoint}:${ColorScheme}`
    | `${MaxWidthBreakpoint}:${ElementState}`
    | `${ColorScheme}:${ElementState}`
    | `${MinWidthBreakpoint}:${MaxWidthBreakpoint}:${ColorScheme}`
    | `${MinWidthBreakpoint}:${MaxWidthBreakpoint}:${ElementState}`
    | `${MinWidthBreakpoint}:${ColorScheme}:${ElementState}`
    | `${MaxWidthBreakpoint}:${ColorScheme}:${ElementState}`
    | `${MinWidthBreakpoint}:${MaxWidthBreakpoint}:${ColorScheme}:${ElementState}`]?: WithDesignToken<S>;
} & WithDesignToken<S>;

export type StyleContext = {
  colorScheme: "light" | "dark";
  windowWidth: number;
  elementState?: ElementState;
};

export const resolveTokenColor = (color: PossibleColorToken): string => {
  const paths = color.split(".");
  if (paths.length !== 2) {
    return color;
  }
  const resolvedColor = paths
    .reduce((acc, path) => {
      return (acc as any)[path];
    }, tokens.colors)
    .toString();
  return resolvedColor ?? color;
};

const resolveDesignTokenValue = (token: string, value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }
  switch (token) {
    case "color":
    case "backgroundColor":
    case "borderColor": {
      return resolveTokenColor(value as PossibleColorToken);
    }
    default:
      return value;
  }
};

const resolveDesignTokenFromStyle = (style: { [key: string]: any }) => {
  return Object.entries(style).reduce<{ [key: string]: any }>(
    (acc, [key, value]) => {
      acc[key] = resolveDesignTokenValue(key, value);
      return acc;
    },
    {}
  );
};

export const composeStyles = (
  context: StyleContext,
  ...styles: DecoStyle<StyleProp<any>>[]
) => {
  const mergedStyles = styles.reduce<{ [key: string]: any }>(
    (accumulator, currentStyle) => {
      return {
        ...accumulator,
        ...(currentStyle as any),
      };
    },
    {}
  );
  let outputStyles = {} as StyleProp<any>;
  Object.keys(mergedStyles).forEach((key) => {
    if (styleAttributes[key]) {
      outputStyles[key] = resolveDesignTokenValue(key, mergedStyles[key]);
      return;
    }
    const modifiers = new Set(key.split(":"));
    let minWidthBreakpoint = undefined;
    for (const modifier of modifiers) {
      const group = modifierGroupMap[modifier];
      if (!group) {
        continue;
      }
      if (group === "minWidth") {
        const breakpoint = normalizeUnit(
          tokens.screens[modifier as MinWidthBreakpoint]
        );

        if (context.windowWidth >= breakpoint) {
          outputStyles = {
            ...outputStyles,
            ...resolveDesignTokenFromStyle(mergedStyles[key]),
          };
        }
        minWidthBreakpoint = breakpoint;
      } else if (group === "maxWidth") {
        const standardizedWidthBreakpoint = modifier.replace("max-", "");
        const breakpoint = normalizeUnit(
          tokens.screens[standardizedWidthBreakpoint as MinWidthBreakpoint]
        );
        if (minWidthBreakpoint) {
          if (context.windowWidth >= minWidthBreakpoint) {
            outputStyles = {
              ...outputStyles,
              ...resolveDesignTokenFromStyle(mergedStyles[key]),
            };
          }
        } else {
          if (context.windowWidth <= breakpoint) {
            outputStyles = {
              ...outputStyles,
              ...resolveDesignTokenFromStyle(mergedStyles[key]),
            };
          }
        }
      } else if (group === "colorScheme") {
        if (context.colorScheme === modifier) {
          outputStyles = {
            ...outputStyles,
            ...resolveDesignTokenFromStyle(mergedStyles[key]),
          };
        }
      } else if (group === "elementState") {
        if (context.elementState === modifier) {
          outputStyles = {
            ...outputStyles,
            ...resolveDesignTokenFromStyle(mergedStyles[key]),
          };
        }
      }
    }
  });

  return outputStyles;
};
