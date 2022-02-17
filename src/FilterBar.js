
import { useState } from 'react';
import { Form } from 'semantic-ui-react';

import { Chiclet } from './components/Chiclet';
import { PartialChiclet } from './components/PartialChiclet';
import { SuggestionsDropdown } from './components/SuggestionsDropdown';

import { entityStateMachine } from './entity-state/entityStateMachine';
import { useStateMachine } from './hooks/useStateMachine';

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
    if (part === 'operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return entityStateMachine.sendEvent("editPartialOperator", { filter });
    }
  };

  const onClickChiclet = (event, filter, part) => {
    if (part === 'operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return entityStateMachine.sendEvent("editOperator", { filter });
    }

    if (part === 'value') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return entityStateMachine.sendEvent("editValue", { filter });
    }

    if (part === 'logical-operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return entityStateMachine.sendEvent("editLogicalOperator", { filter });
    }
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
          open={props.showSuggestions}
          position={dropdownPos}
          loading={props.isLoading}
          editing={Boolean(props.editFilter)}
          suggestions={props.suggestions}
          error={props.error}
          onOpen={onOpenSuggestionsDropdown}
          onClose={onCloseSuggestionsDropdown}
          onSelectItem={onSelectSuggestionItem}
          onCreateItem={onCreateSuggestionItem}
        />
      </Form.Group>
    </Form>
  );
}
