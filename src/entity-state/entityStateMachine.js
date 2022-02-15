import { StateMachine } from "../lib/state-machine";
import { suggestionService } from "../suggestion-services";
import { entityStateMachineContext } from "./entityStateMachineContext";

import {
  idle,
  loadAttributeSuggestions,
  displayAttributeSuggestions,
  loadOperatorSuggestions,
  displayOperatorSuggestions,
  loadValueSuggestions,
  displayValueSuggestions,
} from "./states";

export const entityStateMachine = new StateMachine({
  initialStateId: "idle",
  onTransition: (transition, ctx) => console.log('📟', transition, ctx.get()),
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
  },
});
