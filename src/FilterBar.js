
import { Form } from 'semantic-ui-react';

import { Chiclet } from './components/Chiclet';
import { PartialChiclet } from './components/PartialChiclet';
import { SuggestionsDropdown } from './components/SuggestionsDropdown';

import { entityStateMachine } from './entity-state/entityStateMachine';
import { useStateMachine } from './entity-state/useStateMachine';

export const FilterBar = () => {
  const [props] = useStateMachine(entityStateMachine);

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
      return entityStateMachine.sendEvent("editPartialOperatorSuggestion", { filter });
    }
  };

  const onClickChiclet = (event, filter, part) => {
    if (part === 'operator') {
      return entityStateMachine.sendEvent("editOperatorSuggestion", { filter });
    }

    if (part === 'value') {
      return entityStateMachine.sendEvent("editValueSuggestion", { filter });
    }

    if (part === 'logical-operator') {
      return entityStateMachine.sendEvent("editLogicalOperatorSuggestion", { filter });
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
          open={props.isDisplayed}
          loading={props.isLoading}
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
