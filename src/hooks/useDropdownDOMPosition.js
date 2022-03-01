import { useEffect } from 'react';

export const useDropdownDOMPosition = (open, editing, position) => {
  useEffect(() => {
    if (editing) {
      document.querySelector('.ui.search.dropdown').style.position = 'absolute';
      document.querySelector('.ui.search.dropdown').style.top = `${position.top}px`;
      document.querySelector('.ui.search.dropdown').style.left = `${position.left}px`;
      document.querySelector('.ui.search.dropdown > input.search').click();
    } else {
      document.querySelector('.ui.search.dropdown').style.position = null;
      document.querySelector('.ui.search.dropdown').style.top = null;
      document.querySelector('.ui.search.dropdown').style.left = null;

      if (open) {
        // force a click to work when a chiclet is removed and a partial filter exists
        document.querySelector('.ui.search.dropdown > input.search').click();
      }
    }
  }, [open, editing, position]);
};
