import { Dropdown } from 'semantic-ui-react'

const loadingSuggestions = [
  { key: 'loading', text: 'Loading...', value: 'loading' },
  { key: 'empty-1', text: '', value: '' },
  { key: 'empty-2', text: '', value: '' },
];

export const SuggestionsDropdown = ({
  open,
  loading,
  suggestions,
  error,
  onOpen,
  onClose,
  onSelectItem,
  onCreateItem,
}) => {
  const options = loading ? loadingSuggestions : suggestions.map(({ id, value, label }) => ({
    key: id,
    text: label,
    // 1. we do this to ensure a unique value becausewhen onChange is called, the only property
    // received is value
    // 2. Using id here creates a UI bug where selecting with the keyboard then pressing enter
    // does not work when the 2nd dropdown it opened
    value: `${id}-${value}`,
  }));

  const onCustomSelectItem = (e, { value }) => {
    if (loading) {
      return;
    }

    // we don't receive the full item, only its value :/
    const item = suggestions.find((item) => `${item.id}-${item.value}` === value);

    if (item) {
      onSelectItem(e, item);
    } else {
      onCreateItem(e, { id: null, value, label: value });
    }
  };

  return (
    <Dropdown
      additionLabel="Search text: "
      allowAdditions
      closeOnChange={false}
      error={Boolean(error)}
      loading={loading}
      noResultsMessage={error ? "Ooops! Fetch error." : "No results found."}
      onChange={onCustomSelectItem}
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      openOnFocus={false}
      options={options}
      search
      selection
      selectOnBlur={false}
      selectOnNavigation={false}
    />
  );
};
