import { useState } from 'react';

import './App.css';
import { Chiclet } from './components/Chiclet';
import { PartialChiclet } from './components/PartialChiclet';
import { SuggestionsDropdown } from './components/SuggestionsDropdown';
import { entityStateMachine } from './state-machine/entityStateMachine';

const useMachineContext = () => {
  const machineContext = entityStateMachine.getCurrentContext();

  const [props, setProps] = useState(machineContext.get());

  machineContext.onUpdate(setProps);

  return [props];
};

function App() {
  const [props] = useMachineContext();

  const onOpenSuggestionsDropdown = () => {
    entityStateMachine.sendEvent("onInputFocus");
  };

  const onCloseSuggestionsDropdown = () => {
    entityStateMachine.sendEvent("onDiscardSuggestions");
  };

  const onSelectSuggestionItem = (event, { value }) => {
    entityStateMachine.sendEvent("onSelectItem", {
      value,
      label: event.target.textContent,
    });
  };

  const onRemoveChiclet = (event, filter) => {
    entityStateMachine.sendEvent("onRemoveFilter", filter);
  };

  return (
    <div className="container">
      <form>
        {props.filters.map((filter) => (
          <Chiclet
            key={filter.id}
            filter={filter}
            onRemove={onRemoveChiclet}
          />
        ))}

        <PartialChiclet filter={props.partialFilter} />

        <SuggestionsDropdown
          loading={props.loading}
          suggestions={props.suggestions}
          onOpen={onOpenSuggestionsDropdown}
          onClose={onCloseSuggestionsDropdown}
          onSelectItem={onSelectSuggestionItem}
        />
      </form>
    </div>
  );
}

export default App;
