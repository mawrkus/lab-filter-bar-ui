import { copy } from "fastest-json-copy";
import { StateMachineContext } from "./lib/state-machine";

export class AppStateMachineContext extends StateMachineContext {
  constructor({ initFilters, onUpdateFilters }) {
    super({
      partialFilter: {
        id: "partial",
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
        selectionType: "single", // "single" or "multiple"
      },
      edition: null,
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
        selectionType: "single",
      },
      edition: null,
    });
  }

  // loading states
  startLoading(selectionType = "single") {
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

  doneLoading(items, selectionType = "single", error = null) {
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
    return (
      Boolean(ctxValue.partialFilter.attribute) ||
      Boolean(ctxValue.partialFilter.operator)
    );
  }

  hasMissingPartialOperator() {
    const ctxValue = this.get();
    return !ctxValue.partialFilter.operator;
  }

  hasMissingPartialValue() {
    const ctxValue = this.get();
    return (
      Boolean(ctxValue.partialFilter.attribute) &&
      Boolean(ctxValue.partialFilter.operator)
    );
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

  setPartialFilterAttribute(filterAttribute) {
    const ctxValue = this.get();
    const { partialFilter } = ctxValue;

    partialFilter.attribute = filterAttribute;
    ctxValue.edition = null;

    this.set(ctxValue);
  }

  setPartialFilterOperator(filterOperator) {
    const ctxValue = this.get();
    const { partialFilter } = ctxValue;

    partialFilter.operator = filterOperator;
    ctxValue.edition = null;

    this.set(ctxValue);
  }

  completePartialFilter(filterValue, type = "attribute-operator-value") {
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
    ctxValue.edition = null;

    this._nofityFiltersUpdate(filters, { action: "create", filter: newFilter });

    this.set(ctxValue);
  }

  completePartialAttributeOperatorFilter(filterOperator) {
    this.setPartialFilterOperator(filterOperator);

    const filterValue = {
      id: null,
      value: filterOperator.presetValue,
      label: String(filterOperator.presetValue),
    };

    this.completePartialFilter(filterValue, "attribute-operator");
  }

  createSearchTextFilter(filterValue) {
    const ctxValue = this.get();
    const { filters } = ctxValue;

    const newFilter = {
      id: ctxValue.filterId,
      attribute: null,
      operator: null,
      value: filterValue,
      type: "search-text",
    };

    filters.push(newFilter);

    ctxValue.filterId += 1;
    ctxValue.edition = null;

    this._nofityFiltersUpdate(filters, { action: "create", filter: newFilter });
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
      type: "logical-operator",
    };

    filters.push(newFilter);

    ctxValue.filterId += 1;
    ctxValue.edition = null;

    this._nofityFiltersUpdate(filters, { action: "create", filter: newFilter });
    this.set(ctxValue);
  }

  // filters edition
  startEditing(part, completedFilter = null) {
    const ctxValue = this.get();
    const targetFilter = completedFilter || ctxValue.partialFilter;

    this.set({
      ...ctxValue,
      edition: {
        filter: targetFilter,
        part,
      },
    });
  }

  stopEditing() {
    this.set({
      ...this.get(),
      edition: null,
    });
  }

  isEditing() {
    return this.get().edition !== null;
  }

  isEditingPartialFilter() {
    return this.get().edition?.filter?.id === "partial";
  }

  editFilterOperator(newOperator) {
    const ctxValue = this.get();
    const filterUnderEdition = ctxValue.edition.filter;
    const filter = ctxValue.filters.find((f) => f.id === filterUnderEdition.id);
    const prevFilter = copy(filter)

    filter.operator = newOperator;

    this._nofityFiltersUpdate(ctxValue.filters, {
      action: "edit",
      prevFilter,
      filter,
      part: "operator",
    });

    this.set(ctxValue);
  }

  /*
    single-value operators:
      = -> != (only change operator) => displayPartialFilterSuggestions
      = -> IS NULL (change operator and value) => displayPartialFilterSuggestions
      = -> IN (change operator and value becomes an array) => loadValueSuggestions

    preset-value operators:
      IS NULL -> IS NOT NULL (only change operator) => displayPartialFilterSuggestions
      IS NULL -> = (change operator and value) => loadValueSuggestions
      IS NULL -> IN (change operator and value and value becomes an array) => loadValueSuggestions

    multiple-value operators
      IN -> NOT IN (only change operator) => displayPartialFilterSuggestions
      IN -> = (change operator and value becomes a primitive) => loadValueSuggestions
      IN -> IS NULL (change operator and value and value becomes a primitive) => displayPartialFilterSuggestions
  */
  convertFilterOperator(newOperator, startEditingValue = false) {
    const ctxValue = this.get();
    const filterUnderEdition = ctxValue.edition.filter;
    const operatorUnderEdition = filterUnderEdition.operator;
    const filter = ctxValue.filters.find((f) => f.id === filterUnderEdition.id);
    const prevFilter = copy(filter);

    filter.operator = newOperator;

    // = -> IS NULL
    if (newOperator.type === "preset-value") {
      filter.value = {
        id: null,
        value: newOperator.presetValue,
        label: String(newOperator.presetValue),
      };

      filter.type = "attribute-operator";
    } else if (newOperator.type === "multiple-value") {
      // = -> IN, IS NULL -> IN
      if (operatorUnderEdition.type === "single-value") {
        // = -> IN
        if (filterUnderEdition.value.id === null) {
          // search text
          filter.value = null; // no search text support in multiple suggestions dropdown component :/
        } else {
          filter.value.id = [filterUnderEdition.value.id];
          filter.value.value = [filterUnderEdition.value.value];
        }
      } else if (operatorUnderEdition.type === "preset-value") {
        // IS NULL -> IN
        filter.value = null; // no search text support in multiple suggestions dropdown component :/
        filter.type = "attribute-operator-value";
      }
    } else if (newOperator.type === "single-value") {
      // IS NULL -> =, IN -> =
      if (operatorUnderEdition.type === "preset-value") {
        filter.value = {
          id: null,
          value: filterUnderEdition.operator.presetValue,
          label: String(filterUnderEdition.operator.presetValue),
        };

        filter.type = "attribute-operator-value";
      } else if (operatorUnderEdition.type === "multiple-value") { // IN -> =
        filter.value.id = filterUnderEdition.value.id[0];
        filter.value.value = filterUnderEdition.value.value[0];
        filter.value.label = filterUnderEdition.value.label.split(",")[0];
      }
    }

    ctxValue.edition = startEditingValue ? { filter, part: "value" } : null;

    this._nofityFiltersUpdate(ctxValue.filters, {
      action: "edit",
      prevFilter,
      filter,
      part: "operator",
    });

    this.set(ctxValue);
  }

  editFilterValue(newValue) {
    const ctxValue = this.get();
    const { partialFilter, edition } = ctxValue;

    if (!edition) {
      partialFilter.value = newValue;
      ctxValue.edition = null;
      this.set(ctxValue);
      return;
    }

    const filter = ctxValue.filters.find((f) => f.id === edition.filter.id);
    const prevFilter = copy(filter);

    filter.value = newValue;
    ctxValue.edition = null;

    this._nofityFiltersUpdate(ctxValue.filters, {
      action: "edit",
      prevFilter,
      filter,
      part: "value",
    });

    this.set(ctxValue);
  }

  // filters deletion
  removeFilter(filter) {
    const ctxValue = this.get();

    if (!ctxValue.filters.length) {
      return;
    }

    const filterId = filter.id;
    const filterIndex = ctxValue.filters.findIndex((f) => f.id === filterId);
    const filterRemoved = ctxValue.filters[filterIndex];

    ctxValue.filters.splice(filterIndex, 2);

    this._nofityFiltersUpdate(ctxValue.filters, {
      action: "remove",
      filter: filterRemoved,
    });
    this.set(ctxValue);
  }

  getLastFilter() {
    const { filters } = this.get();
    return filters[filters.length - 1];
  }
}
