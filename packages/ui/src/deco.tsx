import type { ComponentType } from "react";
import type { StyleProp } from "react-native";

type PropsHaveStyle<P = unknown> = P & {
  style?: StyleProp<any>;
};

type WithSx<P, S> = {
  sx?: StyleProp<S>;
} & P;

export function deco<Props extends PropsHaveStyle>(
  Component: ComponentType<Props>,
  initialSx?: Props["style"]
) {
  const DecoComponent = (props: WithSx<Props, Props["style"]>) => {
    return (<Component {...props} />) as React.JSX.Element;
  };

  DecoComponent.displayName = `Deco${
    Component?.displayName ?? "NoNameComponent"
  }`;

  return DecoComponent as typeof DecoComponent;
}
