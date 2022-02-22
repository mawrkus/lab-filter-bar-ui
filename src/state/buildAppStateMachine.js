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

export const buildAppStateMachine = ({ initFilters, onUpdateFilters }) => {
  const appStateMachineContext = new AppStateMachineContext({
    initFilters,
    onUpdateFilters,
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
