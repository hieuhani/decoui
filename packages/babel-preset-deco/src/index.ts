import type { ConfigAPI } from "@babel/core";
import { decoPlugin } from "./deco-plugin";

export default function babelPresetDeco(api: ConfigAPI) {
  return {
    plugins: [decoPlugin(api)],
  };
}
