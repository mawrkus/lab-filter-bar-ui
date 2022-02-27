import { useEffect, useState } from 'react';

const getDropdownPosition = (chicletElement, filterType) => {
  const { top, bottom, left } = chicletElement.getBoundingClientRect();
  const leftDec = ['search-text', 'logical-operator'].includes(filterType) ? 27 : 32;
  return { top: bottom - top, left: left - leftDec };
};

export const useDropdownEdition = (open) => {
  const [dropdownPos, setDropdownPos] = useState();
  const [dropdownValue, setDropdownValue] = useState();

  useEffect(() => {
    if (!open) {
      setDropdownValue('');
    }
  }, [open]);

  const setDropdownPosAndValue = (chicletElement, filter, part) => {
    setDropdownPos(getDropdownPosition(chicletElement, filter.type));
    setDropdownValue(`${filter[part].id}-${filter[part].value}`); // See <SuggestionDropdown />
  };

  return [
    dropdownPos,
    dropdownValue,
    setDropdownPosAndValue,
  ];
};
