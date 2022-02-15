import { StateMachineContext } from "../lib/state-machine";

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

  startLoading() {
    this.set({ ...this.get(), isLoading: true, isDisplayed: true });
    return this.get();
  }

  doneLoading(suggestions) {
    this.set({ ...this.get(), isLoading: false, isDisplayed: true, suggestions });
    return this.get();
  }

  isPartialAttributeSelected() {
    return Boolean(this.get().partialFilter.attribute);
  }

  isPartialOperatorSelected() {
    return Boolean(this.get().partialFilter.operator);
  }

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

  removeFilter(filterId) {
    const ctxValue = this.get();

    ctxValue.filters = ctxValue.filters.filter((f) => f.id !== filterId);

    this.set({ ...ctxValue });

    return this.get();
  }

  addFilter(filterValue) {
    const ctxValue = this.get();
    const { partialFilter, filters } = ctxValue;

    filters.push({
      id: ctxValue.filterId,
      attribute: partialFilter.attribute,
      operator: partialFilter.operator,
      value: filterValue,
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
  editFilter: null,
  // TODO: abort signal
});
