import { useEffect } from 'react';

export const usePositionDropdown = (editing, position) => {
  useEffect(() => {
    if (editing) {
      document.querySelector('.ui.search.dropdown').style.position = 'absolute';
      document.querySelector('.ui.search.dropdown').style.top = `${position.top}px`;
      document.querySelector('.ui.search.dropdown').style.left = `${position.left}px`;
      document.querySelector('input.search').click();
    } else {
      document.querySelector('.ui.search.dropdown').style.position = null;
      document.querySelector('.ui.search.dropdown').style.top = null;
      document.querySelector('.ui.search.dropdown').style.left = null;
    }
  }, [editing, position]);
};
