import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, A } from "@decoui/ui";

export default function Native() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Native</Text>
      <Button
        onClick={() => {
          alert("Pressed!");
        }}
        text="Boop"
      />
      <A
        sx={{
          fontSize: 36,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 36,
  },
});
