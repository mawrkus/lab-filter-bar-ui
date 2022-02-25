import { StateMachine, transitionLogger } from "./lib/state-machine";
import { AppStateMachineContext } from "./AppStateMachineContext";
import { buildSuggestionService } from "./suggestion-services";

import {
  idle,
  loadAttributeSuggestions,
  chooseAttribute,
  loadOperatorSuggestions,
  chooseOperator,
  editPartialOperator,
  editOperator,
  loadValueSuggestions,
  chooseValue,
  editValue,
  loadLogicalOperatorSuggestions,
  chooseLogicalOperator,
  editLogicalOperator,
} from "./states";

export const buildAppStateMachine = ({ initFilters, onUpdateFilters }) => {
  const suggestionService = buildSuggestionService();

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
      editPartialOperator,
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
