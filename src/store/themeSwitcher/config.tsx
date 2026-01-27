import { FormattedMessage } from "react-intl";
import {
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdOutlineDesktopWindows,
} from "react-icons/md";

const getPreferredScheme = () =>
  window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches;
export const isCurrentThemeDark = (themeId: IThemeId) => {
  const values = {
    dark: true,
    light: false,
    system: getPreferredScheme(),
  };
  return values[themeId] ?? getPreferredScheme();
};

const themeList: ITheme[] = [
  {
    themeId: "dark",
    locale: <FormattedMessage id="dark" />,
    icon: <MdOutlineDarkMode className="text-2xl" />,
  },
  {
    themeId: "light",
    locale: <FormattedMessage id="light" />,
    icon: <MdOutlineLightMode className="text-2xl" />,
  },
  {
    themeId: "system",
    locale: <FormattedMessage id="system" />,
    icon: <MdOutlineDesktopWindows className="text-2xl"/>,
  },
];
export const getTheme = (themeId: IThemeId = "system") => {
  const themes = themeList;
  const theme = themes.find((theme) => theme.themeId === themeId);
  return theme || themes.find((theme) => theme.themeId === "system");
};

const config = {
  options: themeList,
};

export default config;
