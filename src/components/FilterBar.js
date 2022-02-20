
import { useState } from 'react';
import { Form } from 'semantic-ui-react';

import { Chiclet } from './Chiclet';
import { PartialChiclet } from './PartialChiclet';
import { SuggestionsDropdown } from './SuggestionsDropdown';

import { entityStateMachine } from '../state/entityStateMachine';
import { useStateMachine } from '../hooks';

const getDropdownPosition = (chicletElement) => {
  const { top, bottom, left } = chicletElement.getBoundingClientRect();
  return { top: bottom - top, left: left - 27 };
}

export const FilterBar = () => {
  const [props] = useStateMachine(entityStateMachine);
  const [dropdownPos, setDropdownPos] = useState(null);

  const onOpenSuggestionsDropdown = () => {
    entityStateMachine.sendEvent("startInput");
  };

  const onCloseSuggestionsDropdown = () => {
    entityStateMachine.sendEvent("discardSuggestions");
  };

  const onSelectSuggestionItem = (event, item) => {
    entityStateMachine.sendEvent("selectItem", item);
  };

  const onCreateSuggestionItem = (event, item) => {
    entityStateMachine.sendEvent("createItem", item);
  };

  const onRemoveChiclet = (event, filter) => {
    entityStateMachine.sendEvent("removeFilter", filter);
  };

  const onClickPartialChiclet = (event, filter, part) => {
    if (part === 'attribute') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return entityStateMachine.sendEvent("editPartialAttribute");
    }

    if (part === 'operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return entityStateMachine.sendEvent("editPartialOperator");
    }
  };

  const onClickChiclet = (event, filter, part) => {
    if (part === 'operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return entityStateMachine.sendEvent("editOperator", filter);
    }

    if (part === 'value') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return entityStateMachine.sendEvent("editValue", filter);
    }

    if (part === 'logical-operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return entityStateMachine.sendEvent("editLogicalOperator", filter);
    }
  };

  const onBackspace = () => {
    entityStateMachine.sendEvent("removeLastFilter");
  };

  return (
    <Form>
      <Form.Group>
        {props.filters.map((filter) => (
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
    </Form>
  );
}
