import path from 'node:path';
import { appWithTranslation, useTranslation, UserConfig } from 'next-i18next';

export const nextI18NextConfig: UserConfig = {
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en'],
    fallbackLng: 'pt-BR',
  },
  ns: ['common', 'jobs', 'auth'],
  defaultNS: 'common',
  localePath: path.resolve(process.cwd(), 'public', 'locales'),
};

// Helper hook that automatically falls back to the provided default (or key itself)
export const wrapT = (namespace: string = 'common') => {
  const { t } = useTranslation(namespace);
  return (key: string, fallback?: string) => {
    const translated = t(key);
    return translated === key ? fallback ?? key : translated;
  };
};

export { appWithTranslation }; 