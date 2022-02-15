
import { Form } from 'semantic-ui-react';

import './App.css';
import { Chiclet } from './components/Chiclet';
import { PartialChiclet } from './components/PartialChiclet';
import { SuggestionsDropdown } from './components/SuggestionsDropdown';
import { entityStateMachine } from './entity-state/entityStateMachine';
import { useStateMachineContext } from './hooks/useStateMachineContext';

function App() {
  const [props] = useStateMachineContext(entityStateMachine);

  const onOpenSuggestionsDropdown = () => {
    entityStateMachine.sendEvent("startInput");
  };

  const onCloseSuggestionsDropdown = () => {
    entityStateMachine.sendEvent("discardSuggestions");
  };

  const onSelectSuggestionItem = (event, { value }) => {
    entityStateMachine.sendEvent("selectItem", {
      value,
      label: value || event.target.textContent,
    });
  };

  const onRemoveChiclet = (event, filter) => {
    entityStateMachine.sendEvent("removeFilter", filter);
  };

  const onClickChiclet = (event, filter, part) => {
    if (part === 'operator') {
      return entityStateMachine.sendEvent("editOperatorSuggestion", { filter });
    }

    if (part === 'value') {
      return entityStateMachine.sendEvent("editValueSuggestion", { filter });
    }
  };

  const onClickPartialChiclet = (event, filter, part) => {
    if (part === 'operator') {
      return entityStateMachine.sendEvent("editPartialOperatorSuggestion", { filter });
    }
  };

  return (
    <div className="container">
      <h1>🧪 Rick &amp; Morty filter bar 🧪</h1>

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
            onOpen={onOpenSuggestionsDropdown}
            onClose={onCloseSuggestionsDropdown}
            onSelectItem={onSelectSuggestionItem}
          />
        </Form.Group>
      </Form>
    </div>
  );
}

export default App;
