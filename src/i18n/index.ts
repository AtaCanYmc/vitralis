import { tr } from './tr';
import { en } from './en';

export type Language = 'tr' | 'en';
export type TranslationDict = typeof tr;

export const translations: Record<Language, TranslationDict> = {
  tr,
  en,
};

/**
 * Returns translation dictionary for given language
 */
export function getTranslation(lang: Language): TranslationDict {
  return translations[lang] || translations.tr;
}
