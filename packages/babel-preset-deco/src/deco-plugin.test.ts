import { describe, expect, it } from "@jest/globals";
import { transformSync } from "@babel/core";
import { decoPlugin } from "./deco-plugin";

const transform = (code: string) => {
  return transformSync(code, {
    plugins: [decoPlugin],
    filename: "test.tsx",
    presets: [
      "@babel/preset-typescript",
      ["@babel/preset-react", { runtime: "automatic" }],
    ],
  })?.code;
};

describe("deco-plugin", () => {
  it("should add useDeco hook when deco is used with dark mode", () => {
    const code = `
      function MyComponent() {
        return (
          <View style={deco({ dark: { bg: 'gray.800' } })} />
        );
      }
    `;

    const result = transform(code);
    expect(result).toContain('const deco = useDeco(["colorScheme"])');
    expect(result).toMatchSnapshot();
  });

  it("should add useDeco hook when deco is used with dark mode and should be worked with arrow function", () => {
    const code = `
      const MyComponent = () => {
        return (
          <View style={deco({ dark: { bg: 'gray.800' } })} />
        );
      }
    `;

    const result = transform(code);
    expect(result).toContain('const deco = useDeco(["colorScheme"])');
    expect(result).toMatchSnapshot();
  });

  it("should add useDeco hook when deco is used with breakpoints", () => {
    const code = `
      function MyComponent() {
        return (
          <View style={deco({ sm: { width: 100 }, md: { width: 200 } })} />
        );
      }
    `;

    const result = transform(code);
    expect(result).toContain('const deco = useDeco(["windowWidth"])');
    expect(result).toMatchSnapshot();
  });

  it("should add useDeco hook with multiple reactive props", () => {
    const code = `
      function MyComponent() {
        return (
          <View style={deco({ 
            dark: { bg: 'gray.800' },
            sm: { width: 100 },
            md: { width: 200 }
          })} />
        );
      }
    `;

    const result = transform(code);
    expect(result).toContain(
      'const deco = useDeco(["colorScheme", "windowWidth"]);'
    );
    expect(result).toMatchSnapshot();
  });

  it("should not add useDeco hook for non-reactive props", () => {
    const code = `
      function MyComponent() {
        return (
          <View style={deco({ padding: 10, margin: 20 })} />
        );
      }
    `;

    const result = transform(code);
    expect(result).not.toContain("useDeco");
    expect(result).toMatchSnapshot();
  });

  it("should not transform non-component functions", () => {
    const code = `
      function helperFunction() {
        return deco({ dark: { bg: 'gray.800' } });
      }
    `;

    const result = transform(code);
    expect(result).not.toContain("useDeco");
    expect(result).toMatchSnapshot();
  });

  it("should not duplicate useDeco hook if already present", () => {
    const code = `
      function MyComponent() {
        const deco = useDeco(['colorScheme']);
        return (
          <View style={deco({ dark: { bg: 'gray.800' } })} />
        );
      }
    `;

    const result = transform(code);
    const matches = result?.match(/useDeco/g) || [];
    expect(matches.length).toBe(1);
    expect(result).toMatchSnapshot();
  });

  it("should handle multiple deco calls in the same component", () => {
    const code = `
      function MyComponent() {
        return (
          <>
            <View style={deco({ dark: { bg: 'gray.800' } })} />
            <Text style={deco({ sm: { fontSize: 14 }, md: { fontSize: 16 } })} />
          </>
        );
      }
    `;

    const result = transform(code);
    expect(result).toContain(
      'const deco = useDeco(["colorScheme", "windowWidth"]);'
    );
    expect(result).toMatchSnapshot();
  });
});
