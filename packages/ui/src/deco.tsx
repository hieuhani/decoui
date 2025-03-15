import type { ComponentType } from "react";
import type { TextStyle, ViewStyle, StyleProp } from "react-native";
import { composeStyles, resolveTokenColor, type DecoStyle } from "./style";
import { config } from "./config";
import { tokens } from "./theme";
import type { PossibleColorToken } from "./tokens";

// Types
type StyleContext = {
  colorScheme: "light" | "dark";
  windowWidth: number;
  elementState?: "hover" | "focus" | "active" | "disabled";
};

type PropsHaveStyle<P = unknown> = P & {
  style?: DecoStyle<StyleProp<any>>;
};

type DecoProps<Props> = Props & {
  sx?: DecoStyle<Props extends PropsHaveStyle ? Props["style"] : never>;
};

const getStyleContext = (
  overriddenContext?: Partial<StyleContext>
): StyleContext => {
  return {
    colorScheme:
      overriddenContext?.colorScheme ??
      config.dependencies.colorScheme ??
      "light",
    windowWidth:
      overriddenContext?.windowWidth ?? config.dependencies.windowWidth ?? 768,
    elementState: undefined,
  };
};

/**
 * Creates a higher-order component that adds styling capabilities to a base component
 * @param Component - The base component to wrap
 * @param initialSx - Initial styles to apply
 */
export function decoHOC<Props extends PropsHaveStyle>(
  Component: ComponentType<Props>,
  initialSx?: DecoStyle<Props["style"]>
) {
  const DecoComponent = ({ style, sx, ...props }: DecoProps<Props>) => {
    const context = getStyleContext();
    return (
      <Component
        {...(props as Props)}
        style={composeStyles(context, initialSx, sx, style)}
      />
    );
  };

  DecoComponent.displayName = `Deco${
    Component?.displayName ?? "NoNameComponent"
  }`;

  return DecoComponent;
}

/**
 * Resolves color based on the current color scheme
 * @param light - Color token for light mode
 * @param dark - Color token for dark mode
 */
export function colorLightDark(
  light: PossibleColorToken,
  dark: PossibleColorToken
): string {
  return resolveTokenColor(
    config.dependencies.colorScheme === "dark" ? dark : light
  );
}

/**
 * Applies styling with context-aware capabilities
 * @param sx - Style object to process
 */
export function deco<T extends ViewStyle | TextStyle>(
  sx: DecoStyle<StyleProp<T>>,
  overriddenContext?: Partial<StyleContext>
): StyleProp<T> {
  const context = getStyleContext(overriddenContext);
  return composeStyles(context, sx);
}

/**
 * @deprecated Use `deco` instead.
 */
export const decoStyle = deco;
