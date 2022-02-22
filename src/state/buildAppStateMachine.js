import { StateMachine, transitionLogger } from "./lib/state-machine";
import { AppStateMachineContext } from "./AppStateMachineContext";
import { suggestionService } from "./suggestion-services";

import {
  idle,
  loadAttributeSuggestions,
  chooseAttribute,
  loadOperatorSuggestions,
  chooseOperator,
  editOperator,
  loadValueSuggestions,
  chooseValue,
  editValue,
  loadLogicalOperatorSuggestions,
  chooseLogicalOperator,
  editLogicalOperator,
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
      chooseAttribute,
      loadOperatorSuggestions,
      chooseOperator,
      editOperator,
      loadValueSuggestions,
      chooseValue,
      editValue,
      loadLogicalOperatorSuggestions,
      chooseLogicalOperator,
      editLogicalOperator,
    },
  });

  return appStateMachine;
};
