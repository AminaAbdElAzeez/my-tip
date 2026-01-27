import language from 'utlis/config/language.config';

// import englishLang from '@iso/assets/images/flag/uk.svg';
// import arabicLang from '@iso/assets/images/flag/italy.svg';s

const config = {
  defaultLanguage: language,
  options: [
    {
      languageId: 'english',
      locale: 'en',
      text: 'English',
       icon: '🇺🇸',
       dir:"ltr"
    },
    {
      languageId: 'arabic',
      locale: 'ar',
      text: 'العربية',
      icon: '🇸🇦',
      dir:"rtl"
    },
  ],
};

export function getCurrentLanguage(lang) {
  let selecetedLanguage = config.options[0];
  config.options.forEach(language => {
    if (language.languageId === lang) {
      selecetedLanguage = language;
    }
  });
  return selecetedLanguage;
}
export default config;
