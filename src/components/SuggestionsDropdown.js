import { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { usePositionDropdown, useHandleBackspaceKey } from '../hooks';

const loadingOptions = [
  { key: 'loading', text: 'Loading...', value: 'loading' },
];

const buildOptions = (suggestions) => suggestions.map(({ id, value, label }) => ({
  key: id,
  text: label,
  // 1. we do this to ensure a unique value because when onChange is called, the only property
  // received is value
  // 2. Using id here creates a UI bug where selecting with the keyboard then pressing enter
  // does not work when the 2nd dropdown is opened
  value: `${id}-${value}`,
}));

export const SuggestionsDropdown = ({
  open,
  position,
  loading,
  editing,
  suggestions,
  error,
  onOpen,
  onClose,
  onSelectItem,
  onCreateItem,
  onBackspace,
  value,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  usePositionDropdown(open, editing, position);
  useHandleBackspaceKey(onBackspace);

  const options = loading ? loadingOptions : buildOptions(suggestions);

  const onCustomSelectItem = (e, { value }) => {
    if (loading) {
      return;
    }

    setSearchQuery('');

    // we don't receive the full item, only its value
    const item = suggestions.find((item) => `${item.id}-${item.value}` === value);

    if (item) {
      onSelectItem(e, item);
    } else {
      onCreateItem(e, { id: null, value, label: value });
    }
  };

  const onSearchChange = (e, { searchQuery: rawSearchQuery }) => {
    if (loading) {
      return;
    }

    setSearchQuery(rawSearchQuery);

    const searchQuery = rawSearchQuery.toLowerCase();

    // we don't receive the full item, only its value and...
    // ...we use the value because the label can be composed (e.g. season + number of episodes)
    const item = suggestions.find(({ label, searchLabel }) => String(searchLabel || label).toLowerCase() === searchQuery);

    if (item) {
      setSearchQuery('')
      onSelectItem(e, item);
    }
  };

  return (
    <Dropdown
      additionLabel="Search for: "
      allowAdditions
      closeOnChange={false}
      error={Boolean(error)}
      loading={loading}
      noResultsMessage={error ? "💥 Ooops! Fetch error." : "No results found."}
      onChange={onCustomSelectItem}
      onClose={onClose}
      onOpen={onOpen}
      onSearchChange={onSearchChange}
      open={open}
      openOnFocus={false}
      options={options}
      placeholder="Add filter..."
      search
      searchQuery={searchQuery}
      selection
      selectOnBlur={false}
      selectOnNavigation={false}
      value={value}
    />
  );
};
