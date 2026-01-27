
const themeSwitcherActions = {
  CHANGE_THEME: 'CHANGE_THEME',

  changeTheme: (selectedTheme:IThemeId) => {
    console.log("hi")

    return {
      type: themeSwitcherActions.CHANGE_THEME,
      payload:{
        theme : selectedTheme,
      }
    };
  },
};
export default themeSwitcherActions;
