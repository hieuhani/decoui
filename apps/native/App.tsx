import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { A, deco } from "@decoui/ui";

export default function Native() {
  return (
    <View
      style={deco({
        flex: 1,
        backgroundColor: "gray.200",
        alignItems: "center",
        justifyContent: "center",
        dark: {
          backgroundColor: "gray.800",
        },
      })}
    >
      <Text
        style={deco({
          fontWeight: "bold",
          marginBottom: 20,
          fontSize: 36,
          color: "gray.800",
          dark: {
            color: "gray.200",
          },
        })}
      >
        Native
      </Text>

      <A
        sx={{
          color: "amber.100",
          fontSize: 16,
        }}
        style={{
          fontWeight: "bold",
        }}
      >
        Hello
      </A>
      <StatusBar style="auto" />
    </View>
  );
}
