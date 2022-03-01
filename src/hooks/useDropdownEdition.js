import { useEffect, useState } from 'react';

const getDropdownPosition = (chicletElement, filterType) => {
  const { top, bottom, left } = chicletElement.getBoundingClientRect();
  const leftDec = filterType === 'search-text' ? 27 : 31;
  return { top: bottom - top, left: left - leftDec };
};

export const useDropdownEdition = (open, editing) => {
  const [dropdownValue, setDropdownValue] = useState();

  useEffect(() => {
    if (!open || !editing) {
      document.querySelector('.ui.search.dropdown').style.position = null;
      document.querySelector('.ui.search.dropdown').style.top = null;
      document.querySelector('.ui.search.dropdown').style.left = null;

      setDropdownValue('');
    }

    if (open) {
      // force a click to work when a chiclet is removed and a partial filter exists
      document.querySelector('.ui.search.dropdown > input.search').click();
    }
  }, [open, editing]);

  const setDropdownPosAndValue = (chicletElement, filter, part) => {
    const position = getDropdownPosition(chicletElement, filter.type);

    document.querySelector('.ui.search.dropdown').style.position = 'absolute';
    document.querySelector('.ui.search.dropdown').style.top = `${position.top}px`;
    document.querySelector('.ui.search.dropdown').style.left = `${position.left}px`;

    setDropdownValue(`${filter[part].id}-${filter[part].value}`); // See <SuggestionDropdown />
  };

  return [
    dropdownValue,
    setDropdownPosAndValue,
  ];
};
