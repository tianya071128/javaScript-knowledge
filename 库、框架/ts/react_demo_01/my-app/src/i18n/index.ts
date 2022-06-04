import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en';
import ch from './ch';

i18n
  // detect user language 检测用户语言
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next. 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // init i18next 初始化 i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true, // 输出信息到控制台
    fallbackLng: 'zh-CN', // 如果用户语言的翻译不可用时使用的语言
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default 不需要反应，因为它默认逃逸
    },
    resources: {
      en: {
        translation: en,
      },
      'zh-CN': {
        translation: ch,
      },
    },
  });

export default i18n;
