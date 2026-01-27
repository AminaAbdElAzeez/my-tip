
import actions from './actions';
import {  isCurrentThemeDark } from './config';
const defaultTheme = 'system'
const initState = {
  themeName: defaultTheme,
  isDark:isCurrentThemeDark(defaultTheme)
};

export default function ThemesSwitcher(state = initState, action) {
  switch (action.type) {
    case actions.CHANGE_THEME:
      // localStorage.setItem('theme' ,action.theme)
      return {
        themeName: action.payload.theme,
        isDark:isCurrentThemeDark(action.payload.theme)

      };
    default:
      return state;
  }
}
