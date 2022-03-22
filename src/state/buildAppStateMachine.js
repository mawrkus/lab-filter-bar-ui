import { StateMachine, transitionLogger } from "./lib/state-machine";
import { AppStateMachineContext } from "./AppStateMachineContext";
import { buildSuggestionService } from "./suggestion-services";

import {
  idle,
  loadAttributeSuggestions,
  chooseAttribute,
  editAttribute,
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
  displayPartialFilterSuggestions,
} from "./states";

export const buildAppStateMachine = ({ initFilters, onUpdateFilters, onTransition = () => {} }) => {
  const suggestionService = buildSuggestionService();

  const appStateMachineContext = new AppStateMachineContext({
    initFilters,
    onUpdateFilters,
  });

  const appStateMachine = new StateMachine({
    initialStateId: "idle",
    onTransition(...args){
      transitionLogger(...args);
      onTransition(...args);
    },
    context: appStateMachineContext,
    toolkit: { suggestionService },
    states: {
      idle,
      loadAttributeSuggestions,
      chooseAttribute,
      editAttribute,
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
      displayPartialFilterSuggestions,
    },
  });

  return appStateMachine;
};
