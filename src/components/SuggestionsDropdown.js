import { Dropdown } from 'semantic-ui-react'

const loadingSuggestions = [{ key: 'loading', text: 'Loading...', value: 'laoding' }];
const noop = () => {};

export const SuggestionsDropdown = ({
  loading,
  suggestions,
  onSelectItem,
  onOpen,
  onClose,
}) => {
  const options = loading ? loadingSuggestions : suggestions.map(({ id, label, value }) => ({
    key: id,
    text: label,
    value,
  }));

  return (
    <Dropdown
      search
      selection
      selectOnBlur={false}
      selectOnNavigation={false}
      options={options}
      onChange={loading ? noop : onSelectItem}
      onOpen={onOpen}
      onClose={onClose}
    />
  );
};
