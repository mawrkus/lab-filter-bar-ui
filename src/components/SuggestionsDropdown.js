import { Dropdown } from 'semantic-ui-react'

const noop = () => {};
const loadingSuggestions = [
  { key: 'loading', text: 'Loading...', value: 'loading' },
  { key: 'empty-1', text: '', value: '' },
  { key: 'empty-2', text: '', value: '' },
  { key: 'empty-3', text: '', value: '' },
];

export const SuggestionsDropdown = ({
  open,
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

  console.log('open=', open);

  return (
    <Dropdown
      search
      selection
      openOnFocus={false}
      open={open}
      loading={loading}
      selectOnBlur={false}
      selectOnNavigation={false}
      options={options}
      onChange={loading ? noop : onSelectItem}
      onOpen={onOpen}
      onClose={onClose}
    />
  );
};
