import { StateMachine, transitionLogger } from "./lib/state-machine";
import { suggestionService } from "./suggestion-services";
import { appStateMachineContext } from "./appStateMachineContext";

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

export const appStateMachine = new StateMachine({
  initialStateId: "idle",
  onTransition: transitionLogger,
  context: appStateMachineContext,
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
