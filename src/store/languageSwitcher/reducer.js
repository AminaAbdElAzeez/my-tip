import config, { getCurrentLanguage } from './config';

import actions from './actions';

const initState = {
  language: getCurrentLanguage(config.defaultLanguage),
};

export default function LanguageSwitcher(state = initState, action) {
  switch (action.type) {

    case actions.CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    default:
      return state;
  }
}
