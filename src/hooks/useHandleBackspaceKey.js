import { useEffect } from 'react';

export const useHandleBackspaceKey = (onBackspace) => {
  useEffect(() => {
    const searchInput = document.querySelector('.ui.dropdown.search > input.search');

    const onKeyDown = (e) => {
      if (e.code === 'Backspace' && e.target.value === '') {
        onBackspace(e);
      }
    };

    searchInput.addEventListener('keydown', onKeyDown);

    return () => {
      searchInput.removeEventListener('keydown', onKeyDown);
    };
  }, [onBackspace]);
};
