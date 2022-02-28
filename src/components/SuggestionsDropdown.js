import { Dropdown } from 'semantic-ui-react';
import { useDropdownPosition, useHandleBackspaceKey } from '../hooks';

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
  useDropdownPosition(open, editing, position);
  useHandleBackspaceKey(onBackspace);

  const options = loading ? loadingOptions : buildOptions(suggestions);

  const onCustomSelectItem = (e, { value }) => {
    if (loading) {
      return;
    }

    const searchQuery = value.toLowerCase();

    // we don't receive the full item, only its value
    const item = suggestions.find((item) => `${item.id}-${item.value}` === value
      || String(item.searchLabel || item.label).toLowerCase() === searchQuery);

    if (item) {
      onSelectItem(e, item);
    } else {
      onCreateItem(e, { id: null, value, label: value });
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
      open={open}
      openOnFocus={false}
      options={options}
      placeholder="Add filter..."
      search
      selection
      selectOnBlur={false}
      selectOnNavigation={false}
      value={value}
    />
  );
};
