export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";

type RGB = { r: number; g: number; b: number; a?: number };
type HSL = { h: number; s: number; l: number; a?: number };
type OKLCH = { l: number; c: number; h: number; a?: number };

function parseAlpha(value: string) {
  const alpha = Number.parseFloat(value);
  if (Number.isNaN(alpha)) throw new Error("Invalid alpha value");
  return Math.max(0, Math.min(1, value.endsWith("%") ? alpha / 100 : alpha));
}

function hexToRgb(value: string): RGB {
  const source = value.replace(/^#/, "");
  if (![3, 4, 6, 8].includes(source.length) || !/^[a-f\d]+$/i.test(source)) throw new Error("Invalid hex color");
  const hex = source.length <= 4 ? source.split("").map((part) => part.repeat(2)).join("") : source;
  return { r: Number.parseInt(hex.slice(0, 2), 16), g: Number.parseInt(hex.slice(2, 4), 16), b: Number.parseInt(hex.slice(4, 6), 16), a: hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : undefined };
}

function rgbToHex({ r, g, b, a }: RGB) {
  const channel = (number: number) => Math.round(Math.max(0, Math.min(255, number))).toString(16).padStart(2, "0");
  const hex = `#${channel(r)}${channel(g)}${channel(b)}`;
  return a === undefined ? hex : `${hex}${channel(a * 255)}`;
}

function rgbToHsl({ r: red, g: green, b: blue, a }: RGB): HSL {
  const r = red / 255; const g = green / 255; const b = blue / 255;
  const max = Math.max(r, g, b); const min = Math.min(r, g, b); const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100), a };
  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let h = max === r ? (g - b) / delta + (g < b ? 6 : 0) : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  h /= 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100), a };
}

function hslToRgb({ h, s, l, a }: HSL): RGB {
  const hue = h / 360; const saturation = s / 100; const lightness = l / 100;
  if (saturation === 0) return { r: Math.round(lightness * 255), g: Math.round(lightness * 255), b: Math.round(lightness * 255), a };
  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const hueToRgb = (t: number) => {
    const value = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (value < 1 / 6) return p + (q - p) * 6 * value;
    if (value < 1 / 2) return q;
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
    return p;
  };
  return { r: Math.round(hueToRgb(hue + 1 / 3) * 255), g: Math.round(hueToRgb(hue) * 255), b: Math.round(hueToRgb(hue - 1 / 3) * 255), a };
}

function rgbToOklch({ r: red, g: green, b: blue, a }: RGB): OKLCH {
  const linear = (channel: number) => { const value = channel / 255; return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4; };
  const r = linear(red); const g = linear(green); const b = linear(blue);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const first = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const second = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: Number(lightness.toFixed(3)), c: Number(Math.sqrt(first ** 2 + second ** 2).toFixed(3)), h: Math.round((Math.atan2(second, first) * 180 / Math.PI + 360) % 360), a };
}

function oklchToRgb({ l, c, h, a }: OKLCH): RGB {
  const hue = h * Math.PI / 180; const first = c * Math.cos(hue); const second = c * Math.sin(hue);
  const long = (l + 0.3963377774 * first + 0.2158037573 * second) ** 3;
  const medium = (l - 0.1055613458 * first - 0.0638541728 * second) ** 3;
  const short = (l - 0.0894841775 * first - 1.291485548 * second) ** 3;
  const gamma = (channel: number) => { const value = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(value * 255))); };
  return { r: gamma(4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short), g: gamma(-1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short), b: gamma(-0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short), a };
}

export function convertColor(value: string, target: ColorFormat) {
  let rgb: RGB;
  if (value.startsWith("#")) rgb = hexToRgb(value);
  else if (value.startsWith("rgb")) {
    const parts = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+%?))?\s*\)/i);
    if (!parts) throw new Error("Invalid RGB color");
    rgb = { r: Number(parts[1]), g: Number(parts[2]), b: Number(parts[3]), a: parts[4] ? parseAlpha(parts[4]) : undefined };
  } else if (value.startsWith("hsl")) {
    const parts = value.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*([\d.]+%?))?\s*\)/i);
    if (!parts) throw new Error("Invalid HSL color");
    rgb = hslToRgb({ h: Number(parts[1]), s: Number(parts[2]), l: Number(parts[3]), a: parts[4] ? parseAlpha(parts[4]) : undefined });
  } else if (value.startsWith("oklch")) {
    const parts = value.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i);
    if (!parts) throw new Error("Invalid OKLCH color");
    rgb = oklchToRgb({ l: parts[1].endsWith("%") ? Number.parseFloat(parts[1]) / 100 : Number(parts[1]), c: Number(parts[2]), h: Number(parts[3]), a: parts[4] ? parseAlpha(parts[4]) : undefined });
  } else throw new Error("Unsupported color format");
  if (target === "hex") return rgbToHex(rgb);
  if (target === "rgb") return rgb.a === undefined ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
  if (target === "hsl") { const hsl = rgbToHsl(rgb); return hsl.a === undefined ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})`; }
  const oklch = rgbToOklch(rgb);
  return oklch.a === undefined ? `oklch(${oklch.l} ${oklch.c} ${oklch.h})` : `oklch(${oklch.l} ${oklch.c} ${oklch.h} / ${oklch.a})`;
}

export function convertCssColors(css: string, target: ColorFormat) {
  return css.split("\n").map((line) => {
    if (!line.trim() || /^\s*(\/\*|\/\/)/.test(line)) return line;
    const replace = (regex: RegExp) => line.replace(regex, (match) => { try { return convertColor(match, target); } catch { return match; } });
    return replace(/oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+(?:\s*\/\s*[\d.]+%?)?\s*\)/gi)
      .replace(/#[0-9a-f]{3,8}\b/gi, (match) => { try { return convertColor(match, target); } catch { return match; } })
      .replace(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+%?)?\s*\)/gi, (match) => { try { return convertColor(match, target); } catch { return match; } })
      .replace(/hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%(?:\s*,\s*[\d.]+%?)?\s*\)/gi, (match) => { try { return convertColor(match, target); } catch { return match; } });
  }).join("\n");
}
