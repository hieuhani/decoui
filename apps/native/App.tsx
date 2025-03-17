import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { deco, H3 } from "@decoui/ui";
import { ArrowComponent } from "./ArrowComponent";
import { DebugTheme } from "./DebugTheme";

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
        Deco UI
      </Text>
      <DebugTheme />
      <ArrowComponent />
      <H3
        sx={{
          color: "blue.800",
          marginVertical: 0,
          dark: { color: "blue.200" },
        }}
      >
        Semantics tag
      </H3>
      <StatusBar style="auto" />
    </View>
  );
}
