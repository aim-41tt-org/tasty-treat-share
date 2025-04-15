
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Инициализируем тему из localStorage или используем системные настройки
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Проверяем сохраненные настройки
    if (typeof window === 'undefined') return false;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Если настройки не сохранены, проверяем системные предпочтения
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Применяем тему к документу
  useEffect(() => {
    // Сначала удаляем все классы темы для избежания конфликтов
    document.documentElement.classList.remove('light', 'dark');
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Хук для использования контекста темы
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
