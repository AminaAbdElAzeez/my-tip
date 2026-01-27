type IThemeId = "dark" | "light" | "system";
interface ISelectedTheme {
  themeName: IThemeId;
  isDark: boolean;
}

type ITheme = {
  themeId: IThemeId;
  locale: any;
  icon: any;
};
