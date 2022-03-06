import { useEffect, useState } from 'react';

const getDropdownPosition = (chicletElement, filter) => {
  const { top, bottom, left } = chicletElement.getBoundingClientRect();
  let leftDec = 31;

  if (filter.type === 'search-text') {
    leftDec = 22;
  } else if (filter.value?.id?.length) { // multi values
    leftDec = 26;
  }

  return { top: bottom - top, left: left - leftDec };
};

export const useDropdownEdition = (open, editing) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const dropdownElement = document.querySelector('.ui.search.dropdown');

    if (!open || !editing) {
      setSelectedItem(null);

      dropdownElement.style.position = null;
      dropdownElement.style.top = null;
      dropdownElement.style.left = null;
    }

    if (editing && position) {
      dropdownElement.style.position = 'absolute';
      dropdownElement.style.top = `${position.top}px`;
      dropdownElement.style.left = `${position.left}px`;
    }

    if (open) {
      // force a click to work when a chiclet is removed and a partial filter exists
      dropdownElement.querySelector('input.search').click();
    }
  }, [open, editing, position]);

  const setSelectedItemAndPosition = (filter, part, chicletElement) => {
    setSelectedItem(filter[part]);
    setPosition(getDropdownPosition(chicletElement, filter));
  };

  return [
    selectedItem,
    setSelectedItem,
    setSelectedItemAndPosition,
  ];
};
