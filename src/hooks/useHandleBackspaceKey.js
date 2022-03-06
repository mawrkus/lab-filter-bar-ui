import { useEffect } from 'react';

export const useHandleBackspaceKey = (onBackspace) => {
  useEffect(() => {

    const onKeyDown = (e) => {
      if (e.code === 'Backspace' && e.target.value === '') {
        onBackspace(e);
      }
    };

    const searchInputElement = document.querySelector('.ui.dropdown.search > input.search');

    searchInputElement.addEventListener('keydown', onKeyDown);

    return () => {
      searchInputElement.removeEventListener('keydown', onKeyDown);
    };
  }, [onBackspace]);
};
