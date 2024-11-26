import { test, expect, describe } from "vitest";
import {
  composeStyles,
  resolveTokenColor,
  type DecoStyle,
  type StyleContext,
} from "../style";
import type { StyleProp } from "react-native";

describe("style", () => {
  test("composeStyles", () => {
    const testCases: {
      context: StyleContext;
      styles: DecoStyle<StyleProp<any>>[];
      expectedStyle: StyleProp<any>;
    }[] = [
      {
        context: {
          colorScheme: "light",
          windowWidth: 500,
        },
        styles: [
          {
            fontSize: 16,
          },
          {
            color: "red",
            width: 100,
            lg: {
              width: 200,
            },
          },
        ],
        expectedStyle: {
          fontSize: 16,
          color: "red",
          width: 100,
        },
      },
      {
        context: {
          colorScheme: "dark",
          windowWidth: 500,
        },
        styles: [
          {
            fontSize: 16,
          },
          {
            color: "red",
            width: 100,
            dark: {
              color: "green",
              width: 200,
            },
          },
        ],
        expectedStyle: {
          fontSize: 16,
          color: "green",
          width: 200,
        },
      },
      {
        context: {
          colorScheme: "dark",
          windowWidth: 642,
        },
        styles: [
          {
            fontSize: 16,
          },
          {
            color: "red",
            width: 100,
            sm: {
              color: "green",
              width: 200,
              fontSize: 18,
            },
          },
        ],
        expectedStyle: {
          fontSize: 18,
          color: "green",
          width: 200,
        },
      },
      {
        context: {
          colorScheme: "dark",
          windowWidth: 642,
        },
        styles: [
          {
            color: "red",
            width: 100,
            "sm:dark": {
              color: "green",
              width: 200,
              fontSize: 18,
            },
          },
        ],
        expectedStyle: {
          fontSize: 18,
          color: "green",
          width: 200,
        },
      },
      {
        context: {
          colorScheme: "dark",
          windowWidth: 642,
        },
        styles: [
          {
            color: "red",
            width: 100,
            "sm:max-lg": {
              color: "green",
              width: 200,
              fontSize: 18,
            },
          },
        ],
        expectedStyle: {
          fontSize: 18,
          color: "green",
          width: 200,
        },
      },
      {
        context: {
          colorScheme: "dark",
          windowWidth: 642,
        },
        styles: [
          {
            color: "red",
            width: 100,
            "max-lg": {
              color: "green",
              width: 200,
              fontSize: 18,
            },
          },
        ],
        expectedStyle: {
          fontSize: 18,
          color: "green",
          width: 200,
        },
      },
      {
        context: {
          colorScheme: "dark",
          windowWidth: 642,
          elementState: "hover",
        },
        styles: [
          {
            color: "red",
            width: 100,
            hover: {
              color: "green",
              width: 200,
              fontSize: 18,
            },
          },
        ],
        expectedStyle: {
          fontSize: 18,
          color: "green",
          width: 200,
        },
      },
      {
        context: {
          colorScheme: "light",
          windowWidth: 500,
        },
        styles: [
          {
            color: "red.100",
          },
        ],
        expectedStyle: {
          color: "#fee2e2",
        },
      },
      {
        context: {
          colorScheme: "dark",
          windowWidth: 500,
        },
        styles: [
          {
            color: "red.100",
            dark: {
              color: "green.300",
            },
          },
        ],
        expectedStyle: {
          color: "#86efac",
        },
      },
    ];

    testCases.forEach(({ context, styles, expectedStyle }) => {
      const composedStyles = composeStyles(context, ...styles);
      expect(composedStyles).toEqual(expectedStyle);
    });
  });

  test("resolveTokenColor", () => {
    const amberColor = resolveTokenColor("amber.100");
    expect(amberColor).toEqual("#fef3c7");

    const inheritColor = resolveTokenColor("inherit");
    expect(inheritColor).toEqual("inherit");
  });
});
