import { registerRootComponent } from "expo";
import { config } from "@decoui/ui";
import App from "./App";
import { Appearance, Dimensions } from "react-native";

config.setup({
  windowWidth: Dimensions.get("window").width,
  colorScheme: Appearance.getColorScheme(),
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
