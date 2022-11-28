import { createI18n } from 'vue-i18n';
// import lance from '@/utils/lance';

export function loadLang() {
  const context = import.meta.globEager('./lang/*.js');
  const messages = {};

  const langs = Object.keys(context);
  for (const key of langs) {
    if (key === './index.js') return;
    const { lang } = context[key];
    const name = key.replace(/(\.\/lang\/|\.js)/g, '');

    messages[name] = lang;
  }

  return messages;
}

export const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: window.localStorage.getItem('awl-lang') || 'kh',
  fallbackLocale: window.localStorage.getItem('awl-lang') || 'kh',
  messages: loadLang(),
});

export const i18nt = i18n.global.t;

export function setLang(locale) {
  i18n.global.locale = locale;
}
