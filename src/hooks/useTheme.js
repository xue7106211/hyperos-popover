import { useState, useEffect } from 'react';

/**
 * useTheme Hook
 * 
 * 管理应用的主题状态（Light/Dark），提供以下功能：
 * 1. 主题状态管理
 * 2. 主题切换功能
 * 3. localStorage 持久化
 * 4. 自动更新 document.documentElement 的 data-theme 属性
 * 
 * @returns {Object} { theme, toggleTheme }
 *   @property {string} theme - 当前主题 ('light' | 'dark')
 *   @property {Function} toggleTheme - 切换主题的函数
 */
export function useTheme() {
  // 从 localStorage 读取保存的主题，如果没有则默认为 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || 'light';
    }
    return 'light';
  });

  // 当主题变化时，更新 DOM 和 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 更新 document.documentElement 的 data-theme 属性
      document.documentElement.setAttribute('data-theme', theme);
      
      // 保存到 localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // 切换主题
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}

