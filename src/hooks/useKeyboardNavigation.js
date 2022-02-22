import { useEffect } from 'react';

export const useKeyboardNavigation = () => {
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (['Enter', 'ArrowDown'].includes(e.code)) {
        if (document.activeElement.closest('.chiclet')) {
          document.activeElement.click();
        }
      }
    });
  }, []);
};
