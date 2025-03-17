import { deco } from "@decoui/ui";
import { useColorScheme, Text } from "react-native";

export const DebugTheme = () => {
  const colorScheme = useColorScheme();
  return (
    <Text
      style={deco({
        fontSize: 20,
        color: "green.800",
        dark: { color: "green.200" },
      })}
    >
      {colorScheme}
    </Text>
  );
};
