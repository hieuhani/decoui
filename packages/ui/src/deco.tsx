import type { ComponentType } from "react";
import { composeStyles, type DecoStyle } from "./style";
import type { StyleProp } from "react-native";
import { config } from "./config";
import { tokens } from "./theme";

type PropsHaveStyle<P = unknown> = P & {
  style?: DecoStyle<StyleProp<any>>;
};

export function deco<Props extends PropsHaveStyle>(
  Component: ComponentType<Props>,
  initialSx?: DecoStyle<Props["style"]>
) {
  const DecoComponent = ({
    style,
    sx,
    ...props
  }: Props & { sx?: DecoStyle<StyleProp<Props["style"]>> }) => {
    const context = {
      colorScheme: config.dependencies.colorScheme ?? "light",
      windowWidth:
        config.dependencies.windowWidth ?? typeof tokens.screens.sm === "number"
          ? +tokens.screens.sm
          : 500,
      elementState: undefined,
    };
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

  return DecoComponent as typeof DecoComponent;
}
