import { StateMachine, transitionLogger } from "./lib/state-machine";
import { suggestionService } from "./suggestion-services";
import { entityStateMachineContext } from "./entityStateMachineContext";

import {
  idle,
  loadAttributeSuggestions,
  displayAttributeSuggestions,
  loadOperatorSuggestions,
  displayOperatorSuggestions,
  loadValueSuggestions,
  displayValueSuggestions,
  loadLogicalSuggestions,
  displayLogicalSuggestions,
} from "./states";

export const entityStateMachine = new StateMachine({
  initialStateId: "idle",
  onTransition: transitionLogger,
  context: entityStateMachineContext,
  toolkit: { suggestionService },
  states: {
    idle,
    loadAttributeSuggestions,
    displayAttributeSuggestions,
    loadOperatorSuggestions,
    displayOperatorSuggestions,
    loadValueSuggestions,
    displayValueSuggestions,
    loadLogicalSuggestions,
    displayLogicalSuggestions,
  },
});
