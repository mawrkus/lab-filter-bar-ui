import { useEffect, useState } from 'react';

export const useControlledDropdownValue = (isDropdownOpen) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!isDropdownOpen) {
      // ensures that the dropdown internal value is unselected, if not, editing an operator or a
      // value in two different chiclets might not work, as the dropdown keeps the last selected
      // value and compares it before allowing an update
      // (e.g. change '=' to '!=' in the 1st chiclet then change 'LIKE' to '!=' in the 2nd)
      setValue('');
    }
  }, [isDropdownOpen]);

  return [value, setValue];
};
