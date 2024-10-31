import type { StyleProp } from "react-native";
import ReactNativeStyleAttributes from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { tokens } from "./theme";
import { normalizeUnit } from "./utils/unit";

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
    | `${MinWidthBreakpoint}:${MaxWidthBreakpoint}:${ColorScheme}:${ElementState}`]?: S;
} & S;

export type StyleContext = {
  colorScheme: "light" | "dark";
  windowWidth: number;
  elementState?: ElementState;
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
    if (ReactNativeStyleAttributes[key]) {
      outputStyles[key] = mergedStyles[key]; // TODO: map value with design token
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
            ...mergedStyles[key],
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
              ...mergedStyles[key],
            };
          }
        } else {
          if (context.windowWidth <= breakpoint) {
            outputStyles = {
              ...outputStyles,
              ...mergedStyles[key],
            };
          }
        }
      } else if (group === "colorScheme") {
        if (context.colorScheme === modifier) {
          outputStyles = {
            ...outputStyles,
            ...mergedStyles[key],
          };
        }
      } else if (group === "elementState") {
        if (context.elementState === modifier) {
          outputStyles = {
            ...outputStyles,
            ...mergedStyles[key],
          };
        }
      }
    }
  });

  return outputStyles;
};
