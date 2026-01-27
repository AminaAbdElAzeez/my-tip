import React from "react";
import { Button, theme } from "antd";
import { Dropdown } from "antd";
import languages from "store/languageSwitcher/config";
import { useDispatch, useSelector } from "react-redux";
import LanguageSwitcherActions from "store/languageSwitcher/actions";
import { GrLanguage } from "react-icons/gr";

const { changeLanguage } = LanguageSwitcherActions;

const LangSwitcher: React.FC = () => {
  const { token } = theme.useToken();

  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) =>
      LanguageSwitcher.language
  );

  return (

          <Button
          onClick={()=>{
          const langToSet=  languages.options.find(({languageId})=>languageId!==selectedLanguage.languageId)
         if(langToSet){
           dispatch(changeLanguage(langToSet.languageId));
           console.log('langswitcher',langToSet)
         }

          }}
          type="text"
      className='focus-visible:!outline-none  px-1 py-1 flex items-center box-content !bg-transparent dark:text-white text-black hover:!text-[initial]'
      >
        {/* {selectedLanguage.icon} */}
        <GrLanguage
        style={{
          // color:token.colorTextBase
        }}
        className=" text-2xl" />

      </Button>
   
  );
};

export default LangSwitcher;
