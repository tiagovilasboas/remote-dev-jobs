import { Job } from "@remote-dev-jobs/core";
import {
  appWithTranslation,
  useTranslation,
  UserConfig,
  TFunction,
} from "next-i18next";
import path from "node:path";

export const nextI18NextConfig: UserConfig = {
  i18n: {
    defaultLocale: "pt-BR",
    locales: ["pt-BR", "en"],
    // @ts-expect-error - fallbackLng não existe na tipagem mas funciona na runtime
    fallbackLng: "pt-BR",
  },
  ns: ["common", "jobs", "auth"],
  defaultNS: "common",
  localePath: path.resolve(process.cwd(), "public", "locales"),
};

export function createT(t: TFunction) {
  return (key: string, options?: Record<string, unknown>) => t(key, options);
}

export const createNsT =
  (ns: string) =>
  (t: TFunction) =>
  (key: string, options?: Record<string, unknown>) =>
    t(`${ns}:${key}`, options);

export function useWrapT() {
  const { t } = useTranslation();

  const wrap = (job: Job) => ({
    ...job,
    title: t(`jobs.${job.id}.title`, { defaultValue: job.title }),
    description: t(`jobs.${job.id}.description`, {
      defaultValue: job.description,
    }),
  });

  return { wrap };
}

export { appWithTranslation };
