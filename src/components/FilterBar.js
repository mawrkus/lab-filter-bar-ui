
import { memo, useCallback } from 'react';

import { Chiclet } from './Chiclet';
import { PartialChiclet } from './PartialChiclet';
import { SuggestionsDropdown } from './SuggestionsDropdown';
import { useStateMachine, useKeyboardNavigation, useDropdownEdition } from '../hooks';

const FilterBarComponent = ({ stateMachine }) => {
  const [props] = useStateMachine(stateMachine);

  const [
    dropdownValue,
    setDropdownPosAndValue,
  ] = useDropdownEdition(props.suggestions.visible, props.isEditing, props.suggestions.selectionType);

  useKeyboardNavigation();

  const onClickPartialChiclet = useCallback((event, filter, part) => {
    if (part === 'attribute') {
      setDropdownPosAndValue(event.currentTarget, filter, part);
      return stateMachine.sendEvent("editPartialAttribute");
    }

    if (part === 'operator') {
      setDropdownPosAndValue(event.currentTarget, filter, part);
      return stateMachine.sendEvent("editPartialOperator");
    }
  }, [setDropdownPosAndValue, stateMachine]);

  const onClickChiclet = useCallback((event, filter, part) => {
    if (part === 'operator') {
      setDropdownPosAndValue(event.currentTarget, filter, part);
      return stateMachine.sendEvent("editOperator", filter);
    }

    if (part === 'value') {
      setDropdownPosAndValue(event.currentTarget, filter, part);
      return stateMachine.sendEvent("editValue", filter);
    }

    if (part === 'logical-operator') {
      setDropdownPosAndValue(event.currentTarget, filter, 'operator');
      return stateMachine.sendEvent("editLogicalOperator", filter);
    }
  }, [stateMachine, setDropdownPosAndValue]);

  const onRemoveChiclet = useCallback((event, filter) => {
    stateMachine.sendEvent("removeFilter", filter);
  }, [stateMachine]);

  const onOpenSuggestionsDropdown = () => {
    stateMachine.sendEvent("startInput");
  };

  const onCloseSuggestionsDropdown = () => {
    stateMachine.sendEvent("discardSuggestions");
  };

  const onSelectSuggestionItem = (event, item) => {
    stateMachine.sendEvent("selectItem", item);
  };

  const onCreateSuggestionItem = (event, item) => {
    stateMachine.sendEvent("createItem", item);
  };

  const onBackspace = () => {
    stateMachine.sendEvent("removeLastFilter");
  };

  return (
    <div className="filter-bar">
      <div className="chiclets">
        {props.filters.map((filter, i) => (
          <Chiclet
            key={filter.id}
            filter={filter}
            onClick={onClickChiclet}
            onRemove={onRemoveChiclet}
          />
        ))}

        <PartialChiclet
          filter={props.partialFilter}
          onClick={onClickPartialChiclet}
        />
      </div>

      <div className="suggestions">
        <SuggestionsDropdown
          value={dropdownValue}
          open={props.suggestions.visible}
          loading={props.suggestions.loading}
          error={props.suggestions.error}
          suggestions={props.suggestions.items}
          onOpen={onOpenSuggestionsDropdown}
          onClose={onCloseSuggestionsDropdown}
          onSelectItem={onSelectSuggestionItem}
          onCreateItem={onCreateSuggestionItem}
          onBackspace={onBackspace}
        />
      </div>
    </div>
  );
}

export const FilterBar = memo(FilterBarComponent);
