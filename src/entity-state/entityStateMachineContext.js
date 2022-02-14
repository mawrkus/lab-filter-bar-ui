import { StateMachineContext } from "../lib/state-machine";

export const entityStateMachineContext = new StateMachineContext({
  partialFilter: {
    attribute: null,
    operator: null,
  },
  filterId: 1,
  filters: [],
  suggestions: [],
  loading: false,
});
