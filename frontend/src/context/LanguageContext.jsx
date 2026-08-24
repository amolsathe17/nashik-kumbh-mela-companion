import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../locales/languages';
import { TRANSLATIONS } from '../locales/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [langCode, setLangCode] = useState(() => {
    return localStorage.getItem('kumbh_lang') || 'en';
  });

  const [hasChosenLang, setHasChosenLang] = useState(() => {
    return localStorage.getItem('kumbh_lang_selected') === 'true';
  });

  const currentLang = getLanguageByCode(langCode);

  useEffect(() => {
    localStorage.setItem('kumbh_lang', langCode);
    document.documentElement.lang = langCode;
    document.documentElement.dir = currentLang.dir || 'ltr';
  }, [langCode, currentLang]);

  const changeLanguage = (code) => {
    setLangCode(code);
    setHasChosenLang(true);
    localStorage.setItem('kumbh_lang_selected', 'true');
  };

  // Smart translation function with robust fallback and exact dictionary lookups
  const t = (key) => {
    if (!key) return '';
    const strKey = String(key).trim();

    // 1. Direct match in selected language
    if (TRANSLATIONS[langCode] && TRANSLATIONS[langCode][strKey] !== undefined) {
      return TRANSLATIONS[langCode][strKey];
    }

    // 2. Case-insensitive / trimmed match in selected language
    if (TRANSLATIONS[langCode]) {
      const foundKey = Object.keys(TRANSLATIONS[langCode]).find(
        k => k.toLowerCase() === strKey.toLowerCase()
      );
      if (foundKey) {
        return TRANSLATIONS[langCode][foundKey];
      }
    }

    // 3. Fallback to English dictionary match
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][strKey] !== undefined) {
      return TRANSLATIONS['en'][strKey];
    }

    return strKey;
  };

  return (
    <LanguageContext.Provider value={{
      langCode,
      currentLang,
      changeLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      t,
      hasChosenLang,
      setHasChosenLang
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
