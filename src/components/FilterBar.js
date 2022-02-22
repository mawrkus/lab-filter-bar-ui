
import { memo, useState, useCallback } from 'react';

import { Chiclet } from './Chiclet';
import { PartialChiclet } from './PartialChiclet';
import { SuggestionsDropdown } from './SuggestionsDropdown';
import { useStateMachine, useKeyboardNavigation } from '../hooks';
import { Form } from 'semantic-ui-react';

const getDropdownPosition = (chicletElement) => {
  const { top, bottom, left } = chicletElement.getBoundingClientRect();
  return { top: bottom - top, left: left - 27 };
};

const FilterBarComponent = ({ stateMachine }) => {
  const [props] = useStateMachine(stateMachine);
  const [dropdownPos, setDropdownPos] = useState(null);
  useKeyboardNavigation();

  const onClickPartialChiclet = useCallback((event, filter, part) => {
    if (part === 'attribute') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return stateMachine.sendEvent("editPartialAttribute");
    }

    if (part === 'operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return stateMachine.sendEvent("editPartialOperator");
    }
  }, [stateMachine]);

  const onClickChiclet = useCallback((event, filter, part) => {
    if (part === 'operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return stateMachine.sendEvent("editOperator", filter);
    }

    if (part === 'value') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return stateMachine.sendEvent("editValue", filter);
    }

    if (part === 'logical-operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
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
    <Form.Group>
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

      <SuggestionsDropdown
        position={dropdownPos}
        open={props.suggestions.visible}
        loading={props.suggestions.loading}
        error={props.suggestions.error}
        suggestions={props.suggestions.items}
        editing={props.isEditing}
        onOpen={onOpenSuggestionsDropdown}
        onClose={onCloseSuggestionsDropdown}
        onSelectItem={onSelectSuggestionItem}
        onCreateItem={onCreateSuggestionItem}
        onBackspace={onBackspace}
      />
    </Form.Group>
  );
}

export const FilterBar = memo(FilterBarComponent);
