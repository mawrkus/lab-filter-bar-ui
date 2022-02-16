import { StateMachineContext } from "./lib/state-machine";

class EntityStateMachineContext extends StateMachineContext {
  cancelLoading() {
    // TODO: abort signal

    this.set({
      ...this.get(),
      isLoading: false,
      isDisplayed: false,
      suggestions: [],
      editFilter: null,
    });

    return this.get();
  }

  // loading states
  startLoading() {
    this.set({ ...this.get(), isLoading: true, isDisplayed: true, error: null });
    return this.get();
  }

  doneLoading(suggestions, error = null) {
    this.set({ ...this.get(), isLoading: false, isDisplayed: true, suggestions, error });
    return this.get();
  }

  // partial filters
  isPartialAttributeSelected() {
    return Boolean(this.get().partialFilter.attribute);
  }

  isPartialOperatorSelected() {
    return Boolean(this.get().partialFilter.operator);
  }

  // filter creation/edition
  setFilterAttribute(filterAttribute) {
    const ctxValue = this.get();
    const { partialFilter } = ctxValue;

    partialFilter.attribute = filterAttribute;

    this.set(ctxValue);

    return this.get();
  }

  setFilterOperator(filterOperator) {
    const ctxValue = this.get();
    const { partialFilter, editFilter } = ctxValue;

    if (editFilter) {
      const filter = ctxValue.filters.find((f) => f.id === editFilter.id);
      filter.operator = filterOperator;
    } else {
      partialFilter.operator = filterOperator;
    }

    this.set(ctxValue);

    return this.get();
  }

  setFilterValue(filterValue) {
    const ctxValue = this.get();
    const { partialFilter, editFilter } = ctxValue;

    if (editFilter) {
      const filter = ctxValue.filters.find((f) => f.id === editFilter.id);
      filter.value = filterValue;
    } else {
      partialFilter.value = filterValue;
    }

    this.set(ctxValue);

    return this.get();
  }

  addFilter(filterValue, type='attribute-operator-value') {
    const ctxValue = this.get();
    const { partialFilter, filters } = ctxValue;

    filters.push({
      id: ctxValue.filterId,
      attribute: partialFilter.attribute,
      operator: partialFilter.operator,
      value: filterValue,
      type,
    });

    ctxValue.filterId += 1;

    partialFilter.attribute = null;
    partialFilter.operator = null;

    this.set(ctxValue);

    return this.get();
  }

  setEditFilter(editFilter) {
    this.set({ ...this.get(), editFilter })
  }

  isEditingFilter() {
    return Boolean(this.get().editFilter);
  }

  // filter deletion
  removeFilter(filterId) {
    const ctxValue = this.get();

    ctxValue.filters = ctxValue.filters.filter((f) => f.id !== filterId);

    this.set({ ...ctxValue });

    return this.get();
  }

  lastFilter() {
    const { filters } = this.get();
    return filters[filters.length - 1];
  }
};

export const entityStateMachineContext = new EntityStateMachineContext({
  partialFilter: {
    attribute: null,
    operator: null,
  },
  filters: [],
  filterId: 1,
  isLoading: false,
  isDisplayed: false,
  suggestions: [],
  error: null,
  editFilter: null,
  // TODO: abort signal
});
