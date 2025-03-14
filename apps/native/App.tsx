import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { A, deco } from "@decoui/ui";

export default function Native() {
  return (
    <View
      style={deco({
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <Text
        style={deco({
          fontWeight: "bold",
          marginBottom: 20,
          fontSize: 36,
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
