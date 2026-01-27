import React, { useEffect, useState } from "react";
import { Button, Popover, Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import themeSwitcherActions from "store/themeSwitcher/actions";
import config, { getTheme } from "store/themeSwitcher/config";

const { changeTheme } = themeSwitcherActions;

const ThemesSwitcher: React.FC = () => {
  // theme.useToken(theme.dark)
  const dispatch = useDispatch();
  const { themeName, isDark } = useSelector(
    ({ ThemeSwitcher }: { ThemeSwitcher: ISelectedTheme }) => ThemeSwitcher
  );
  // console.log(themeName)
  // const [status, setStatus] = useState<string>();
  // useEffect(() => {
  //   if (status) {
  //     dispatch(changeTheme(status));
  //   }
  // }, [status]);

  const content = (
    <ul className="min-w-[10rem] flex flex-col gap-[2px] ">
      {config.options.map((el) => (
        <li key={el.themeId}>
          <Button
            className={`${
              el.themeId === themeName
                ? "text-primary hover:!text-[#3bab7b] dark:text-variant dark:hover:!text-variant"
                : ""
            } w-full text-start flex items-center gap-2`}
            type="text"
            onClick={() => {
              dispatch(changeTheme(el.themeId));
            }}
          >
            {el.icon}
            <span>{el.locale}</span>
          </Button>
        </li>
      ))}
    </ul>
  );
  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottom"

      // visible={visible}
      // onVisibleChange={handleVisibleChange}
      // arrowPointAtCenter={false}
    >
      <div
        className={`cursor-pointer focus-visible:!outline-none  px-1 py-1 flex items-center box-content text-[#3bab7b] dark:text-variant `}
      >
        {getTheme(themeName).icon}
      </div>
    </Popover>
  );
};

export default ThemesSwitcher;
