
import { memo, useCallback } from 'react';

import { Chiclet } from './Chiclet';
import { PartialChiclet } from './PartialChiclet';
import { SuggestionsDropdown } from './suggestions/SuggestionsDropdown';
import { useStateMachine, useKeyboardActions, useDropdownEdition } from '../hooks';

const FilterBarComponent = ({ stateMachine }) => {
  const [props] = useStateMachine(stateMachine);

  const [
    selectedDropdownItem,
    setSelectedDropdownItem,
    setSelectedDropdownItemAndPosition,
  ] = useDropdownEdition(props.suggestions.visible, props.isEditing);

  useKeyboardActions();

  const onClickPartialChiclet = useCallback((event, filter, part) => {
    if (part === 'attribute') {
      setSelectedDropdownItemAndPosition(filter, part, event.currentTarget);
      return stateMachine.sendEvent("editPartialAttribute");
    }

    if (part === 'operator') {
      setSelectedDropdownItemAndPosition(filter, part, event.currentTarget);
      return stateMachine.sendEvent("editPartialOperator");
    }
  }, [stateMachine, setSelectedDropdownItemAndPosition]);

  const onClickChiclet = useCallback((event, filter, part) => {
    if (part === 'operator') {
      setSelectedDropdownItemAndPosition(filter, part, event.currentTarget);
      return stateMachine.sendEvent("editOperator", filter);
    }

    if (part === 'value') {
      setSelectedDropdownItemAndPosition(filter, part, event.currentTarget);
      return stateMachine.sendEvent("editValue", filter);
    }

    if (part === 'logical-operator') {
      setSelectedDropdownItemAndPosition(filter, 'operator', event.currentTarget);
      return stateMachine.sendEvent("editLogicalOperator", filter);
    }
  }, [stateMachine, setSelectedDropdownItemAndPosition]);

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
    setSelectedDropdownItem(null);
    stateMachine.sendEvent("selectItem", item);
  };

  const onCreateSuggestionItem = (event, item) => {
    setSelectedDropdownItem(null);
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
          multiple={props.suggestions.selectionType === 'multiple'}
          selectedItem={selectedDropdownItem}
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
