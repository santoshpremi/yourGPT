import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import de from "../../locales/de.json";
import en from "../../locales/en.json";
import es from "../../locales/es.json";
import fr from "../../locales/fr.json";
import it from "../../locales/it.json";

export { useTranslation, Trans } from "react-i18next";

const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  it: {
    translation: it,
  },
};

export type Locales = keyof typeof resources;

export async function loadI18n() {
  await i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      fallbackLng: "en" satisfies Locales,
      resources: resources,
      interpolation: {
        escapeValue: false,
      },
    })
    .catch((err) => {
      console.error("Could not load i18n", err);
      throw err;
    });

  i18next.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
  });
}
