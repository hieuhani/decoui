export type Config = {
  dependencies: {
    colorScheme: null | "light" | "dark";
    windowWidth: number | undefined; // Web: px, Native: dp
  };
  setup: (dependencies: Config["dependencies"]) => void;
};

export const config: Config = {
  dependencies: {
    colorScheme: null,
    windowWidth: undefined,
  },
  setup(initialVariables) {
    config.dependencies = initialVariables;
  },
};
