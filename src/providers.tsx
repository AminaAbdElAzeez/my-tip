import ErrorBoundaryProvider from 'utlis/library/helpers/error-handler/ErrorBoundaryProvider';
import FallBackUI from 'components/fallback-ui';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from 'store/store';
import AppLocale from 'utlis/config/translation';
import { IntlProvider } from 'react-intl';
import { useEffect, useLayoutEffect } from 'react';
import ToastProvider from 'components/ToastProvider/index';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
//import axios from "axios"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import themeSwitcherActions from 'store/themeSwitcher/actions';
import instance from 'utlis/library/helpers/axios';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './pages/layout';
import Index from './pages/page';
import Login from './pages/login/page';
import DashboardLayout from './pages/dashboard/(admin)/layout';

// import Properties from './pages/dashboard/(admin)/properties/page';
import Cities from './pages/dashboard/(admin)/cities/page';
import CityDetails from './pages/dashboard/(admin)/cities/cityDetails/page';
import UserDetails from './pages/dashboard/(admin)/users/userDetails/page';
import Profile from './pages/dashboard/(admin)/profile/page';
import Employers from './pages/dashboard/(admin)/employers/page';
import Statistics from './pages/dashboard/(admin)/statistics/page';
import Bank from './pages/dashboard/(admin)/bank/page';
import Users from './pages/dashboard/(admin)/users/page';
import Suggestions from './pages/dashboard/(admin)/suggestions/page';
import Contacts from './pages/dashboard/(admin)/contacts/page';
import Withdrawals from './pages/dashboard/(admin)/withdrawals/page';
import EmployersDetails from './pages/dashboard/(admin)/employers/employersDetails/page';
import PendingRequests from './pages/dashboard/(admin)/employers/pendingRequests/page';
import SuggestionDetails from './pages/dashboard/(admin)/suggestions/suggestionDetails/page';
import ContactDetails from './pages/dashboard/(admin)/contacts/contactDetails/page';
import PendingUserRequests from './pages/dashboard/(admin)/users/pendingUsers/page';
import Tips from './pages/dashboard/(admin)/tips/page';
import TipsDetails from './pages/dashboard/(admin)/tips/tipsDetails/page';
import SocialMedia from './pages/dashboard/(admin)/socialMedia/page';
import AppVersion from './pages/dashboard/(admin)/appVersion/page';
import ContactTypes from './pages/dashboard/(admin)/contactsType/page';
import Settings from './pages/dashboard/(admin)/settings/page';
import Notifications from './pages/dashboard/(admin)/notifications/page';
import BusinessTypes from './pages/dashboard/(admin)/businessTypes/page';

const router = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Index />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'admin',
        element: <DashboardLayout />,
        children: [
          {
            path: 'employers',
            element: <Employers />,
            children: [
              { path: ':id', element: <EmployersDetails /> },
              { path: 'pending', element: <PendingRequests /> },
            ],
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'statistics',
            element: <Statistics />,
          },
          {
            path: 'banks',
            element: <Bank />,
          },
          {
            path: 'users',
            element: <Users />,
            children: [
              { path: ':id', element: <UserDetails /> },
              { path: 'pending', element: <PendingUserRequests /> },
            ],
          },
          {
            path: 'suggestions',
            element: <Suggestions />,
            children: [{ path: ':id', element: <SuggestionDetails /> }],
          },
          {
            path: 'contacts',
            element: <Contacts />,
            children: [{ path: ':id', element: <ContactDetails /> }],
          },
          {
            path: 'withdrawals',
            element: <Withdrawals />,
          },
          {
            path: 'tips',
            element: <Tips />,
            children: [{ path: ':id', element: <TipsDetails /> }],
          },

          {
            path: 'socialMedia',
            element: <SocialMedia />,
          },
          {
            path: 'appVersion',
            element: <AppVersion />,
          },
          {
            path: 'contactTypes',
            element: <ContactTypes />,
          },
          // {
          //   path: 'suggestionTypes',
          //   element: <Tips />,
          // },
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'notification',
            element: <Notifications />,
          },
          {
            path: 'businessTypes',
            element: <BusinessTypes />,
            children: [{ path: ':id', element: <TipsDetails /> }],
          },
        ],
      },
    ],
  },
]);

const { changeTheme } = themeSwitcherActions;
type Locale = keyof typeof AppLocale;
const queryClient = new QueryClient();

function AppProvider() {
  const dispatch = useDispatch();
  const { locale } = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) => LanguageSwitcher.language,
  );
  const { themeName, isDark } = useSelector(
    ({ ThemeSwitcher }: { ThemeSwitcher: ISelectedTheme }) => ThemeSwitcher,
  );

  const reChangeTheme = () => {
    dispatch(changeTheme('system'));
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const currentAppLocale = AppLocale[locale as Locale];
  useLayoutEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    instance.defaults.headers.common['Accept-Language'] = locale === 'ar' ? 'ar-EG' : 'en-US';
    // instance.defaults.headers.common["X-Language"] =
    //   locale === "ar" ? "ar" : "en";
  }, [locale, dir]);
  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
    if (themeName === 'system') {
      darkModePreference.addEventListener('change', reChangeTheme);
    }
    return () => {
      if (themeName === 'system') {
        darkModePreference.removeEventListener('change', reChangeTheme);
      }
    };
  }, [themeName]);

  useLayoutEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  useEffect(() => {
    instance.defaults.headers['Accept-Language'] = `${locale === 'en' ? 'en-US' : 'ar-SA'}`;
    // instance.defaults.headers["X-Language"] = `${
    //   locale === "en" ? "en-US" : "ar-SA"
    // }`;
  }, [locale]);

  // useEffect(()=>{
  // instance.interceptors.request.use((config) => {
  //   config.headers['Accept-Language'] = `${locale === "en"?"en-US":"ar-SA"}`;
  //   console.log("Intercepted request config:",locale, config);
  //   return config;
  // });
  //  },[locale])

  return (
    <ErrorBoundaryProvider fallBackUIComponent={<FallBackUI />}>
      <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
        <ConfigProvider
          locale={currentAppLocale.antd}
          direction={dir}
          theme={{
            algorithm: antdTheme[isDark ? 'darkAlgorithm' : 'defaultAlgorithm'],
            token: {
              colorPrimary: '#3bab7b',
              // colorPrimaryBg: "#3730a3",
              // colorBorder: "#3730a3",

              colorLink: '',
              colorInfo: '#3bab7b',
            },
          }}
        >
          {/* <RoutersProvider /> */}
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />

            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
          <ToastProvider />
        </ConfigProvider>
      </IntlProvider>
    </ErrorBoundaryProvider>
  );
}
function MainProvider() {
  return (
    <Provider store={store}>
      <AppProvider />
    </Provider>
  );
}

export default MainProvider;
