import type { Theme } from "@mui/joy";
import { extendTheme } from "@mui/joy";
import Values from "values.js";
import { useOrganization } from "../api/organization";
import React from "react";

const indexes = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

function generatePalette(
  color: string | undefined
): Record<string, string> | undefined {
  if (!color) return undefined;

  const values = new Values(color);

  const colors = values.all(20);
  const palette = indexes.reduce((acc, index, i) => {
    acc[index] = colors[i].hexString();
    return acc;
  }, {});

  return palette;
}

const themeCache = new Map<string, Theme>();

const loadingTheme = extendTheme({
  fontFamily: {
    display: "Open Sans Variable",
    body: "Inter Variable",
    fallback: "sans-serif",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: generatePalette("#cccccc"),
      },
    },
  },
});

const noTheme = extendTheme({
  fontFamily: {
    display: "Open Sans Variable",
    body: "Inter Variable",
    fallback: "sans-serif",
  },
});

export const UserContext = React.createContext(null);

export const useTheme = () => {
  const organization = useOrganization();

  if (organization == undefined) return loadingTheme;

  const cacheKey =
    organization?.customPrimaryColor +
    organization?.name +
    organization?.domain +
    organization?.logoUrl +
    organization?.avatarUrl;

  if (themeCache.has(cacheKey)) {
    return themeCache.get(cacheKey);
  }

  const customPrimaryColor = organization?.customPrimaryColor;
  if (!customPrimaryColor) return noTheme;

  const theme = extendTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: generatePalette(
            organization.customPrimaryColor ?? "#cccccc"
          ),
          success: generatePalette("#198754"),
          warning: generatePalette("#FFC107"),
          danger: generatePalette("#DC3644"),
        },
      },
    },
  });
  themeCache.set(cacheKey, theme);
  return theme;
};

export const usePrimaryColor = () => {
  const theme = useTheme();
  return theme?.palette.primary[500];
};

export const useSuccessColor = () => {
  const theme = useTheme();
  if (!theme) return "#198754";
  return theme.palette.success[500];
};

export const useWarningColor = () => {
  const theme = useTheme();
  if (!theme) return "#FFC107";
  return theme?.palette.warning[500];
};

export const useDangerColor = () => {
  const theme = useTheme();
  if (!theme) return "#DC3644";
  return theme?.palette.danger[500];
};
