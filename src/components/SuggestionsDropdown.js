import { Dropdown } from 'semantic-ui-react'

export const SuggestionsDropdown = ({
  suggestions,
  onSelectItem,
  onOpen,
  onClose,
}) => {
  const options = suggestions.map(({ id, label, value }) => ({
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
      onChange={onSelectItem}
      onOpen={onOpen}
      onClose={onClose}
    />
  );
};
