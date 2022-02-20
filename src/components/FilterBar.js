
import { useState } from 'react';
import { Form } from 'semantic-ui-react';

import { Chiclet } from './Chiclet';
import { PartialChiclet } from './PartialChiclet';
import { SuggestionsDropdown } from './SuggestionsDropdown';

import { appStateMachine } from '../state/appStateMachine';
import { useStateMachine } from '../hooks';

const getDropdownPosition = (chicletElement) => {
  const { top, bottom, left } = chicletElement.getBoundingClientRect();
  return { top: bottom - top, left: left - 27 };
}

export const FilterBar = () => {
  const [props] = useStateMachine(appStateMachine);
  const [dropdownPos, setDropdownPos] = useState(null);

  const onOpenSuggestionsDropdown = () => {
    appStateMachine.sendEvent("startInput");
  };

  const onCloseSuggestionsDropdown = () => {
    appStateMachine.sendEvent("discardSuggestions");
  };

  const onSelectSuggestionItem = (event, item) => {
    appStateMachine.sendEvent("selectItem", item);
  };

  const onCreateSuggestionItem = (event, item) => {
    appStateMachine.sendEvent("createItem", item);
  };

  const onRemoveChiclet = (event, filter) => {
    appStateMachine.sendEvent("removeFilter", filter);
  };

  const onClickPartialChiclet = (event, filter, part) => {
    if (part === 'attribute') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return appStateMachine.sendEvent("editPartialAttribute");
    }

    if (part === 'operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return appStateMachine.sendEvent("editPartialOperator");
    }
  };

  const onClickChiclet = (event, filter, part) => {
    if (part === 'operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return appStateMachine.sendEvent("editOperator", filter);
    }

    if (part === 'value') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return appStateMachine.sendEvent("editValue", filter);
    }

    if (part === 'logical-operator') {
      setDropdownPos(getDropdownPosition(event.currentTarget));
      return appStateMachine.sendEvent("editLogicalOperator", filter);
    }
  };

  const onBackspace = () => {
    appStateMachine.sendEvent("removeLastFilter");
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
