
import { useState } from 'react';
import { Form } from 'semantic-ui-react';

import { Chiclet } from './Chiclet';
import { PartialChiclet } from './PartialChiclet';
import { SuggestionsDropdown } from './SuggestionsDropdown';
import { useStateMachine } from '../hooks';

const getDropdownPosition = (chicletElement) => {
  const { top, bottom, left } = chicletElement.getBoundingClientRect();
  return { top: bottom - top, left: left - 27 };
};

export const FilterBar = ({ stateMachine }) => {
  const [props] = useStateMachine(stateMachine);
  const [dropdownPos, setDropdownPos] = useState(null);

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

  const onRemoveChiclet = (event, filter) => {
    stateMachine.sendEvent("removeFilter", filter);
  };

  const onClickPartialChiclet = (event, filter, part) => {
    if (part === 'attribute') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return stateMachine.sendEvent("editPartialAttribute");
    }

    if (part === 'operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return stateMachine.sendEvent("editPartialOperator");
    }
  };

  const onClickChiclet = (event, filter, part) => {
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
  };

  const onBackspace = () => {
    stateMachine.sendEvent("removeLastFilter");
  };

  return (
    <Form>
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
    </Form>
  );
}
