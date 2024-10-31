import { Platform } from "react-native";

const applyOptionsOnConversion = (result: number): number => {
  try {
    return Number.parseFloat(result.toFixed(3));
  } catch (error) {
    console.error(error);

    return result;
  }
};

export const remToPtRaw = (rem: number, fontScale = 1, baseFontSize = 16) =>
  applyOptionsOnConversion(rem * fontScale * baseFontSize * 0.74999943307122);

export const pxToPtRaw = (px: number, fontScale = 1) =>
  applyOptionsOnConversion(px * fontScale * 0.74999943307122);

export const remToPt = (rem: string, fontScale = 1, baseFontSize = 16) => {
  if (rem === "0") {
    return 0;
  }
  if (!rem.endsWith("rem")) {
    throw new Error("Invalid rem unit");
  }
  const value = remToPtRaw(+rem.replace("rem", ""), fontScale, baseFontSize);
  if (Number.isNaN(value)) {
    throw new Error("Invalid rem value");
  }
  return value;
};

export const pxToPt = (px: string | number, fontScale = 1) => {
  if (typeof px === "number") {
    return pxToPtRaw(px, fontScale);
  }
  if (px === "0") {
    return 0;
  }
  if (px === "0px") {
    return 0;
  }
  if (!px.endsWith("px")) {
    throw new Error("Invalid px unit");
  }
  const value = pxToPtRaw(+px.replace("px", ""), fontScale);
  if (Number.isNaN(value)) {
    throw new Error("Invalid px value");
  }
  return value;
};

export const remToPx = (rem: string, baseFontSize = 16) => {
  if (rem === "0") {
    return 0;
  }
  if (!rem.endsWith("rem")) {
    throw new Error("Invalid rem unit");
  }
  const value = +rem.replace("rem", "") * baseFontSize;
  if (Number.isNaN(value)) {
    throw new Error("Invalid rem value");
  }
  return value;
};

export const remToPlatformUnit = (rem: string) => {
  if (Platform.OS === "web") {
    return remToPx(rem);
  }
  return remToPt(rem);
};

export const pxToPlatformUnit = (px: string) => {
  if (Platform.OS === "web") {
    return +px.replace("px", "");
  }
  return pxToPt(px);
};

export const normalizeUnit = (unit: string | number): number => {
  if (typeof unit === "number") {
    return unit;
  }
  if (unit === "0") {
    return 0;
  }
  if (unit === "0px") {
    return 0;
  }
  if (unit.endsWith("rem")) {
    return remToPlatformUnit(unit);
  }
  if (unit.endsWith("px")) {
    return pxToPlatformUnit(unit);
  }
  throw new Error("Invalid unit");
};
