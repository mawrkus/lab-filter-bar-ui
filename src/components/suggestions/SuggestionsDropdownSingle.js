import { Dropdown } from 'semantic-ui-react';
import { buildOptionValue, buildOptions } from './buildOptions';
import { useHandleBackspaceKey } from '../../hooks';

export const SuggestionsDropdownSingle = ({
  selectedItem,
  open,
  loading,
  error,
  suggestions,
  onOpen,
  onClose,
  onSelectItem,
  onBackspace,
}) => {
  useHandleBackspaceKey(onBackspace);

  const onChange = (e, { value: newValue }) => {
    if (loading) {
      return;
    }

    const searchQuery = newValue.toLowerCase();

    // we don't receive the full item, only its value
    const item = suggestions.find((item) => buildOptionValue(item) === newValue
      || String(item.searchLabel || item.label).toLowerCase() === searchQuery);

    if (item) {
      onSelectItem(e, item);
    } else {
      // search text
      onSelectItem(e, { id: null, value: newValue, label: newValue }, true);
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
      onChange={onChange}
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      openOnFocus={false}
      options={buildOptions(loading, suggestions)}
      placeholder="Add filter..."
      search
      selection
      selectOnBlur={false}
      selectOnNavigation={false}
      value={buildOptionValue(selectedItem)}
    />
  );
};
