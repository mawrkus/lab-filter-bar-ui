import { useEffect, useState } from 'react';

const getDropdownPosition = (chicletElement, filterType) => {
  const { top, bottom, left } = chicletElement.getBoundingClientRect();
  const leftDec = filterType === 'search-text' ? 27 : 31;
  return { top: bottom - top, left: left - leftDec };
};

export const useDropdownEdition = (open, editing) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!open || !editing) {
      setSelectedItem(null);

      document.querySelector('.ui.search.dropdown').style.position = null;
      document.querySelector('.ui.search.dropdown').style.top = null;
      document.querySelector('.ui.search.dropdown').style.left = null;
    }

    if (editing && position) {
      document.querySelector('.ui.search.dropdown').style.position = 'absolute';
      document.querySelector('.ui.search.dropdown').style.top = `${position.top}px`;
      document.querySelector('.ui.search.dropdown').style.left = `${position.left}px`;
    }

    if (open) {
      // force a click to work when a chiclet is removed and a partial filter exists
      document.querySelector('.ui.search.dropdown > input.search').click();
    }
  }, [open, editing, position]);

  const setSelectedItemAndPosition = (filter, part, chicletElement) => {
    setSelectedItem(filter[part]);
    setPosition(getDropdownPosition(chicletElement, filter.type));
  };

  return [
    selectedItem,
    setSelectedItem,
    setSelectedItemAndPosition,
  ];
};
