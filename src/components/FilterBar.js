
import { memo, useCallback } from 'react';

import { Chiclet } from './Chiclet';
import { SuggestionsDropdown } from './suggestions/SuggestionsDropdown';
import { useStateMachine, useKeyboardActions, useDropdownEdition } from '../hooks';

const FilterBarComponent = ({ stateMachine }) => {
  const [props] = useStateMachine(stateMachine);
  const [selectedDropdownItem] = useDropdownEdition(props.suggestions.visible, props.edition);

  useKeyboardActions();

  const onClickChiclet = useCallback((event, filter, part) => {
    if (part === 'attribute') {
      return stateMachine.sendEvent("editAttribute", filter);
    }

    if (part === 'operator') {
      return stateMachine.sendEvent("editOperator", filter);
    }

    if (part === 'value') {
      return stateMachine.sendEvent("editValue", filter);
    }

    if (part === 'logical-operator') {
      return stateMachine.sendEvent("editLogicalOperator", filter);
    }
  }, [stateMachine]);

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
