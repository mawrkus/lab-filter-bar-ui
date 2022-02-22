import { StateMachineContext } from "./lib/state-machine";

export class AppStateMachineContext extends StateMachineContext {
  reset(resetError) {
    const ctxValue = this.get();
    const lastLoadingError = ctxValue.suggestions.error;

    this.set({
      ...ctxValue,
      suggestions: {
        visible: resetError ? false : Boolean(lastLoadingError),
        loading: false,
        error: resetError ? null : lastLoadingError,
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

  hasLoadingError() {
    return Boolean(this.get().suggestions.error);
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

  completePartialFilter(filterValue) {
    const ctxValue = this.get();
    const { partialFilter, filters } = ctxValue;

    filters.push({
      id: ctxValue.filterId,
      attribute: partialFilter.attribute,
      operator: partialFilter.operator,
      value: filterValue,
      type: 'attribute-operator-value',
    });

    ctxValue.filterId += 1;

    partialFilter.attribute = null;
    partialFilter.operator = null;

    this.set(ctxValue);
  }

  createSearchTextFilter(filterValue) {
    const ctxValue = this.get();
    const { filters } = ctxValue;

    filters.push({
      id: ctxValue.filterId,
      attribute: null,
      operator: null,
      value: filterValue,
      type: 'search-text',
    });

    ctxValue.filterId += 1;

    this.set(ctxValue);
  }

  createLogicalOperatorFilter(filterOperator) {
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
    this.set({
      ...this.get(),
      isEditing: true,
      filterUnderEdition: completedFilter,
    });
  }

  stopEditing() {
    this.set({
      ...this.get(),
      isEditing: false,
      filterUnderEdition: null,
    });
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

    this.set(ctxValue);
  }

  //
  getLastFilter() {
    const { filters } = this.get();
    return filters[filters.length - 1];
  }
};
