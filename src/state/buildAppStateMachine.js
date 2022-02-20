import { StateMachine, transitionLogger } from "./lib/state-machine";
import { AppStateMachineContext } from "./AppStateMachineContext";
import { suggestionService } from "./suggestion-services";

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

export const buildAppStateMachine = ({ filters }) => {
  const appStateMachineContext = new AppStateMachineContext({
    partialFilter: {
      attribute: null,
      operator: null,
    },
    filters,
    filterId: filters.length + 1,
    suggestions: {
      visible: false,
      loading: false,
      error: null,
      items: [],
    },
    filterUnderEdition: null,
    isEditing: false,
  });

  const appStateMachine = new StateMachine({
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

  return appStateMachine;
};
