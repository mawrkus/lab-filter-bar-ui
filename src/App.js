import { useState } from 'react';

import './App.css';
import { Chiclet } from './components/Chiclet';
import { PartialChiclet } from './components/PartialChiclet';
import { SuggestionsDropdown } from './components/SuggestionsDropdown';
import { entityStateMachine } from './state-machine/entityStateMachine';

const machineContext = entityStateMachine.getCurrentContext();

function App() {
  const [props, setProps] = useState(machineContext.get());
  machineContext.onUpdate(setProps);

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
