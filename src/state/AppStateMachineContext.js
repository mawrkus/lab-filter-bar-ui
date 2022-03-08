import { copy } from "fastest-json-copy";
import { StateMachineContext } from "./lib/state-machine";
import { hasPresetValue } from "./states/operatorSuggestions";

export class AppStateMachineContext extends StateMachineContext {
  constructor({ initFilters, onUpdateFilters }) {
    super({
      partialFilter: {
        id: 'partial',
        attribute: null,
        operator: null,
      },
      filters: initFilters,
      filterId: initFilters.length + 1,
      suggestions: {
        visible: false,
        loading: false,
        error: null,
        items: [],
        selectionType: 'single',
      },
      filterUnderEdition: null,
    });

    this._nofityFiltersUpdate = onUpdateFilters;
  }

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
        selectionType: 'single',
      },
      filterUnderEdition: null,
    });
  }

  // loading states
  startLoading(selectionType = 'single') {
    this.set({
      ...this.get(),
      suggestions: {
        visible: true,
        loading: true,
        error: null,
        items: [],
        selectionType,
      },
    });
  }

  doneLoading(items, selectionType = 'single', error = null) {
    this.set({
      ...this.get(),
      suggestions: {
        visible: true,
        loading: false,
        error,
        items,
        selectionType,
      },
    });
  }

  hasLoadingError() {
    return Boolean(this.get().suggestions.error);
  }

  clearLoadingError() {
    const ctxValue = this.get();
    ctxValue.suggestions.error = null;
    this.set(ctxValue);
  }

  // partial filters
  hasPartialFilter() {
    const ctxValue = this.get();
    return Boolean(ctxValue.partialFilter.attribute) || Boolean(ctxValue.partialFilter.operator);
  }

  hasMissingPartialOperator() {
    const ctxValue = this.get();
    return !ctxValue.partialFilter.operator;
  }

  hasMissingPartialValue() {
    const ctxValue = this.get();
    return Boolean(ctxValue.partialFilter.attribute) && Boolean(ctxValue.partialFilter.operator);
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

    this.set(ctxValue);
  }

  setFilterOperator(filterOperator, startEditing = false) {
    const ctxValue = this.get();
    const { filterUnderEdition } = ctxValue;
    const filter = ctxValue.filters.find((f) => f.id === filterUnderEdition.id);
    const prevFilter = copy(filter);

    filter.operator = filterOperator;

    if (hasPresetValue(filterUnderEdition.operator) && !hasPresetValue(filterOperator)) {
      filter.value = {
        id: null,
        value: filterUnderEdition.operator.presetValue,
        label: String(filterUnderEdition.operator.presetValue),
      };

      filter.type = 'attribute-operator-value';
    } else if (!hasPresetValue(filterUnderEdition.operator) && hasPresetValue(filterOperator)) {
      filter.value = {
        id: null,
        value: filterOperator.presetValue,
        label: String(filterOperator.presetValue),
      };

      filter.type = 'attribute-operator';
    }

    // TODO: NOT IN -> =

    if (filterOperator.selectionType === 'multiple') {
      // handles IS (NOT) NULL and search text values
      if (hasPresetValue(filterUnderEdition.operator) || filterUnderEdition.value.id === null) {
        filter.value = null;
      } else {
        filter.value.id = [filter.value.id];
        filter.value.value = [filter.value.value];
      }
    }

    ctxValue.filterUnderEdition = startEditing ? filter : null;

    this._nofityFiltersUpdate(ctxValue.filters, {
      action: 'edit',
      prevFilter,
      filter,
      part: 'operator',
    });

    this.set(ctxValue);
  }

  setPartialFilterOperator(filterOperator) {
    const ctxValue = this.get();
    const { partialFilter } = ctxValue;

    partialFilter.operator = filterOperator;
    ctxValue.filterUnderEdition = null;

    this.set(ctxValue);
  }

  setFilterAttributeOperator(filterOperator) {
    this.setFilterOperator(filterOperator);

    const filterValue = {
      id: null,
      value: filterOperator.presetValue,
      label: String(filterOperator.presetValue),
    };

    this.setFilterValue(filterValue, 'attribute-operator');
  }

  setFilterValue(filterValue) {
    const ctxValue = this.get();
    const { partialFilter, filterUnderEdition } = ctxValue;

    if (!filterUnderEdition) {
      partialFilter.value = filterValue;
      ctxValue.filterUnderEdition = null;

      this.set(ctxValue);
      return;
    }

    const filter = ctxValue.filters.find((f) => f.id === filterUnderEdition.id);
    const prevFilter = copy(filter);

    filter.value = filterValue;
    ctxValue.filterUnderEdition = null;

    this._nofityFiltersUpdate(ctxValue.filters, {
      action: 'edit',
      prevFilter,
      filter,
      part: 'value',
    });

    this.set(ctxValue);
  }

  completePartialFilter(filterValue, type='attribute-operator-value') {
    const ctxValue = this.get();
    const { partialFilter, filters } = ctxValue;

    const newFilter = {
      id: ctxValue.filterId,
      attribute: partialFilter.attribute,
      operator: partialFilter.operator,
      value: filterValue,
      type,
    };

    filters.push(newFilter);

    ctxValue.filterId += 1;

    partialFilter.attribute = null;
    partialFilter.operator = null;
    ctxValue.filterUnderEdition = null;

    this._nofityFiltersUpdate(filters, { action: 'create', filter: newFilter });
    this.set(ctxValue);
  }

  completePartialAttributeOperatorFilter(filterOperator) {
    this.setPartialFilterOperator(filterOperator);

    const filterValue = {
      id: null,
      value: filterOperator.presetValue,
      label: String(filterOperator.presetValue),
    };

    this.completePartialFilter(filterValue, 'attribute-operator');
  }

  createSearchTextFilter(filterValue) {
    const ctxValue = this.get();
    const { filters } = ctxValue;

    const newFilter = {
      id: ctxValue.filterId,
      attribute: null,
      operator: null,
      value: filterValue,
      type: 'search-text',
    };

    filters.push(newFilter);

    ctxValue.filterId += 1;
    ctxValue.filterUnderEdition = null;

    this._nofityFiltersUpdate(filters, { action: 'create', filter: newFilter });
    this.set(ctxValue);
  }

  createLogicalOperatorFilter(filterOperator) {
    const ctxValue = this.get();
    const { filters } = ctxValue;

    const newFilter = {
      id: ctxValue.filterId,
      attribute: null,
      operator: filterOperator,
      value: null,
      type: 'logical-operator',
    };

    filters.push(newFilter);

    ctxValue.filterId += 1;
    ctxValue.filterUnderEdition = null;

    this._nofityFiltersUpdate(filters, { action: 'create', filter: newFilter });
    this.set(ctxValue);
  }

  // editing states
  startEditing(completedFilter) {
    const ctxValue = this.get();
    const targetFilter = completedFilter || ctxValue.partialFilter;

    this.set({
      ...ctxValue,
      filterUnderEdition: targetFilter,
    });
  }

  stopEditing() {
    this.set({
      ...this.get(),
      filterUnderEdition: null,
    });
  }

  isEditing() {
    return this.get().filterUnderEdition !== null;
  }

  // filter deletion
  removeFilter(filter) {
    const ctxValue = this.get();

    if (!ctxValue.filters.length) {
      return;
    }

    const filterId = filter.id;
    const filterIndex = ctxValue.filters.findIndex((f) => f.id === filterId);
    const filterRemoved = ctxValue.filters[filterIndex];

    ctxValue.filters.splice(filterIndex, 2);

    this._nofityFiltersUpdate(ctxValue.filters, { action: 'remove', filter: filterRemoved });
    this.set(ctxValue);
  }

  //
  getLastFilter() {
    const { filters } = this.get();
    return filters[filters.length - 1];
  }
};
