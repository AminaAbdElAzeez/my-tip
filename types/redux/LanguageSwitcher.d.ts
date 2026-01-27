// declare module 'MLanguageSwitcher' {
    interface ILanguage {
        languageId: string;
        locale: string;
        text: string;
        icon: string;
        dir:"ltr"|"rtl"
    }
    interface ILanguageSwitcher {
        isActivated:boolean;
        language:ILanguage
    }
//   }
