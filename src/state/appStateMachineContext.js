import { StateMachineContext } from "./lib/state-machine";

class AppStateMachineContext extends StateMachineContext {
  reset() {
    this.set({
      ...this.get(),
      suggestions: {
        visible: false,
        loading: false,
        error: null,
        items: [],
      },
      filterUnderEdition: null,
      isEditing: false,
    });

    return this.get();
  }

  // loading states
  startLoading() {
    this.set({
      ...this.get(),
      suggestions: {
        visible: true,
        loading: true,
        error: null,
        items: [],
      },
    });
  }

  doneLoading(items, error = null) {
    this.set({
      ...this.get(),
      suggestions: {
        visible: true,
        loading: false,
        error,
        items,
      },
    });
  }

  // partial filters
  hasPartialAttribute() {
    return Boolean(this.get().partialFilter.attribute);
  }

  hasPartialOperator() {
    return Boolean(this.get().partialFilter.operator);
  }

  hasPartialFilter() {
    return this.hasPartialAttribute() || this.hasPartialOperator();
  }

  removePartialAttribute() {
    const ctxValue = this.get();
    ctxValue.partialFilter.attribute = null;
    this.set(ctxValue);
  }

  removePartialOperator() {
    const ctxValue = this.get();
    ctxValue.partialFilter.operator = null;
    this.set(ctxValue);
  }

  // filter creation/edition
  setFilterAttribute(filterAttribute) {
    const ctxValue = this.get();
    const { partialFilter } = ctxValue;

    partialFilter.attribute = filterAttribute;
    ctxValue.filterUnderEdition = null;
    ctxValue.isEditing = false;

    this.set(ctxValue);
  }

  setFilterOperator(filterOperator) {
    const ctxValue = this.get();
    const { partialFilter, filterUnderEdition } = ctxValue;

    if (filterUnderEdition) {
      const filter = ctxValue.filters.find((f) => f.id === filterUnderEdition.id);
      filter.operator = filterOperator;
      ctxValue.filterUnderEdition = null;
    } else {
      partialFilter.operator = filterOperator;
    }

    ctxValue.isEditing = false;

    this.set(ctxValue);
  }

  setFilterValue(filterValue) {
    const ctxValue = this.get();
    const { partialFilter, filterUnderEdition } = ctxValue;

    if (filterUnderEdition) {
      const filter = ctxValue.filters.find((f) => f.id === filterUnderEdition.id);
      filter.value = filterValue;
      ctxValue.filterUnderEdition = null;
    } else {
      partialFilter.value = filterValue;
    }

    ctxValue.isEditing = false;

    this.set(ctxValue);
  }

  completePartialFilter(filterValue, type='attribute-operator-value') {
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
  }

  createFreeTextFilter(filterValue) {
    const ctxValue = this.get();
    const { filters } = ctxValue;

    filters.push({
      id: ctxValue.filterId,
      attribute: null,
      operator: null,
      value: filterValue,
      type: 'free-text',
    });

    ctxValue.filterId += 1;

    this.set(ctxValue);
  }

  createLogicalOperator(filterOperator) {
    const ctxValue = this.get();
    const { filters } = ctxValue;

    filters.push({
      id: ctxValue.filterId,
      attribute: null,
      operator: filterOperator,
      value: null,
      type: 'logical-operator',
    });

    ctxValue.filterId += 1;

    this.set(ctxValue);
  }

  // editing states
  startEditing(completedFilter) {
    this.set({ ...this.get(), isEditing: true, filterUnderEdition: completedFilter });
  }

  stopEditing() {
    this.set({ ...this.get(), isEditing: false, filterUnderEdition: null });
  }

  isEditing() {
    return this.get().isEditing;
  }

  // filter deletion
  removeFilter(filter) {
    const ctxValue = this.get();

    if (!ctxValue.filters.length) {
      return;
    }

    const filterId = filter.id;
    const filterIndex = ctxValue.filters.findIndex((f) => f.id === filterId);

    ctxValue.filters.splice(filterIndex, 2);

    this.set({ ...ctxValue });
  }

  //
  getLastFilter() {
    const { filters } = this.get();
    return filters[filters.length - 1];
  }
};

export const appStateMachineContext = new AppStateMachineContext({
  partialFilter: {
    attribute: null,
    operator: null,
  },
  filters: [],
  filterId: 1,
  suggestions: {
    visible: false,
    loading: false,
    error: null,
    items: [],
  },
  filterUnderEdition: null,
  isEditing: false,
});
