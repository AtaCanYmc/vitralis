/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  CurrencyCode,
  CurrencyConfig,
  StudioContextState,
  StudioDefaults,
  StudioProfile,
} from '../types/studio';
import {
  CURRENCIES,
  INITIAL_STUDIO_DEFAULTS,
  INITIAL_STUDIO_PROFILE,
} from '../constants/defaults';
import type { Language } from '../i18n';

const PROFILE_STORAGE_KEY = 'vitralis_studio_profile_v1';
const DEFAULTS_STORAGE_KEY = 'vitralis_studio_defaults_v1';

const StudioContext = createContext<StudioContextState | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<StudioProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STUDIO_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved studio profile:', e);
    }
    return INITIAL_STUDIO_PROFILE;
  });

  const [defaults, setDefaultsState] = useState<StudioDefaults>(() => {
    try {
      const saved = localStorage.getItem(DEFAULTS_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STUDIO_DEFAULTS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved studio defaults:', e);
    }
    return INITIAL_STUDIO_DEFAULTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to persist studio profile:', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(DEFAULTS_STORAGE_KEY, JSON.stringify(defaults));
    } catch (e) {
      console.error('Failed to persist studio defaults:', e);
    }

    const root = document.documentElement;
    if (defaults.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [defaults]);

  const updateProfile = (partial: Partial<StudioProfile>) => {
    setProfileState(prev => ({ ...prev, ...partial }));
  };

  const updateDefaults = (partial: Partial<StudioDefaults>) => {
    setDefaultsState(prev => ({ ...prev, ...partial }));
  };

  const setLanguage = (lang: Language) => {
    updateDefaults({ language: lang });
  };

  const setTheme = (theme: 'dark' | 'light') => {
    updateDefaults({ theme });
  };

  const setCurrency = (currency: CurrencyCode) => {
    updateDefaults({ currency });
  };

  const resetToFactoryDefaults = () => {
    setProfileState(INITIAL_STUDIO_PROFILE);
    setDefaultsState(INITIAL_STUDIO_DEFAULTS);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(DEFAULTS_STORAGE_KEY);
  };

  const activeCurrency: CurrencyConfig = CURRENCIES[defaults.currency] || CURRENCIES.TRY;

  return (
    <StudioContext.Provider
      value={{
        profile,
        defaults,
        activeCurrency,
        updateProfile,
        updateDefaults,
        setLanguage,
        setTheme,
        setCurrency,
        resetToFactoryDefaults,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = (): StudioContextState => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
