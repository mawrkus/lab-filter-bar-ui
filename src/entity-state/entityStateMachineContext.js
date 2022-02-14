import { StateMachineContext } from "../lib/state-machine";

class EntityStateMachineContext extends StateMachineContext {
  cancelLoading() {
    // TODO: abort signal
    this.set({ ...this.get(), isLoading: false, suggestions: [] });
    return this.get();
  }

  startLoading() {
    this.set({ ...this.get(), isLoading: true });
    return this.get();
  }

  doneLoading(suggestions) {
    this.set({ ...this.get(), isLoading: false, suggestions });
    return this.get();
  }

  isAttributeSelected() {
    return Boolean(this.get().partialFilter.attribute);
  }

  isOperatorSelected() {
    return Boolean(this.get().partialFilter.operator);
  }

  removeFilter(filterId) {
    const ctxValue = this.get();

    ctxValue.filters = ctxValue.filters.filter((f) => f.id !== filterId);

    this.set({ ...ctxValue });

    return this.get();
  }
};

export const entityStateMachineContext = new EntityStateMachineContext({
  partialFilter: {
    attribute: null,
    operator: null,
  },
  filterId: 1,
  filters: [],
  suggestions: [],
  isLoading: false,
  // TODO: abort signal
});
