import { deco } from "@decoui/ui";
import { Text } from "react-native";

export const ArrowComponent = () => {
  return (
    <Text
      style={deco({
        color: "gray.800",
        dark: { color: "red.400" },
        fontSize: 20,
      })}
    >
      Arrow function
    </Text>
  );
};
