import { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import { buildOptions, buildOptionValue } from "./buildOptions";
import { useHandleMultiBackspaceKey } from "../../hooks";

const getInitialValue = (selectedItem) =>
  selectedItem
    ? selectedItem.id.reduce(
        (acc, singleId, i) => [...acc, `${singleId}-${selectedItem.value[i]}`],
        []
      )
    : [];

export const SuggestionsDropdownMulti = ({
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
  const [selectedValue, setSelectedValue] = useState(
    getInitialValue(selectedItem)
  );

  useEffect(() => {
    setSelectedValue(getInitialValue(selectedItem));
  }, [selectedItem]);

  useHandleMultiBackspaceKey(onBackspace, selectedValue);

  const onChange = (e, { value: rawNewValues }) => {
    if (!loading) {
      // prevent free text suggestions to be added, because the component triggers a change event
      // but does not allow the free text item to be created in the UI anyway
      const newValues = rawNewValues.filter((newValue) =>
        suggestions.find((item) => buildOptionValue(item) === newValue)
      );

      setSelectedValue(newValues);
    }
  };

  const onCustomClose = (e, data) => {
    if (!data.value.length) {
      // setTimeout to prevent warning in the Dropdown component:
      // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
      setTimeout(() => onClose(e, data), 0);
      return;
    }

    const itemIds = [];
    const itemValues = [];
    const itemLabels = [];

    for (let newValue of data.value) {
      const item = suggestions.find(
        (item) => buildOptionValue(item) === newValue
      );

      itemIds.push(item.id);
      itemValues.push(item.value);
      itemLabels.push(item.label);
    }

    const item = {
      id: itemIds,
      value: itemValues,
      label: itemLabels.join(", "),
    };

    // setTimeout to prevent warning in the Dropdown component:
    // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
    setTimeout(() => onSelectItem(e, item), 0);
  };

  return (
    <Dropdown
      additionLabel="Search for: "
      allowAdditions
      clearable
      closeOnChange={false}
      error={Boolean(error)}
      loading={loading}
      multiple
      noResultsMessage={error ? "💥 Ooops! Fetch error." : "No results found."}
      onChange={onChange}
      onClose={onCustomClose}
      onOpen={onOpen}
      open={open}
      openOnFocus={false}
      options={buildOptions(loading, suggestions)}
      placeholder="Add filter..."
      search
      selection
      selectOnBlur={false}
      selectOnNavigation={false}
      value={selectedValue}
    />
  );
};
