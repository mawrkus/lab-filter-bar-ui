import { copy } from "fastest-json-copy";
import { StateMachineContext } from "./lib/state-machine";

export class AppStateMachineContext extends StateMachineContext {
  constructor({ initFilters, onUpdateFilters }) {
    super({
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
  getPartialFilter(ctxValue = this.get()) {
    return ctxValue.filters.find((f) => f.type === "partial");
  }

  hasPartialFilter() {
    return Boolean(this.getPartialFilter());
  }

  hasMissingPartialOperator() {
    return this.getPartialFilter().operator === null;
  }

  hasMissingPartialValue() {
    return this.getPartialFilter().value === null;
  }

  removePartialAttribute() {
    const ctxValue = this.get();

    ctxValue.filters = ctxValue.filters.filter((f) => f.type !== "partial");

    this.set(ctxValue);
  }

  removePartialOperator() {
    const ctxValue = this.get();

    this.getPartialFilter(ctxValue).operator = null;

    this.set(ctxValue);
  }

  setPartialFilterAttribute(filterAttribute) {
    const ctxValue = this.get();
    const { edition, filters } = ctxValue;

    if (edition) {
      const filterUnderEdition = ctxValue.filters.find(
        (f) => f.id === edition.filter.id
      );

      filterUnderEdition.attribute = filterAttribute;
      ctxValue.edition = null;

      this.set(ctxValue);

      return;
    }

    const newPartialFilter = {
      id: ctxValue.filterId,
      attribute: filterAttribute,
      operator: null,
      value: null,
      type: "partial",
    };

    filters.push(newPartialFilter);

    ctxValue.filterId += 1;

    this.set(ctxValue);
  }

  setPartialFilterOperator(filterOperator) {
    const ctxValue = this.get();

    this.getPartialFilter(ctxValue).operator = filterOperator;

    ctxValue.edition = null;

    this.set(ctxValue);
  }

  completePartialFilter(filterValue, type = "attribute-operator-value") {
    const ctxValue = this.get();
    const partialFilter = this.getPartialFilter(ctxValue);
    const { filters } = ctxValue;

    partialFilter.value = filterValue;
    partialFilter.type = type;

    ctxValue.edition = null;

    this._nofityFiltersUpdate(filters, {
      action: "create",
      filter: partialFilter,
    });

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
  startEditing(part, targetFilter) {
    const ctxValue = this.get();

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
    return this.get().edition?.filter?.type === "partial";
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
  editFilterOperator(newOperator, startEditingValue = false) {
    const ctxValue = this.get();
    const filterUnderEdition = ctxValue.edition.filter;
    const operatorUnderEdition = filterUnderEdition.operator;
    const filter = ctxValue.filters.find((f) => f.id === filterUnderEdition.id);
    const prevFilter = copy(filter);

    filter.operator = newOperator;

    ctxValue.edition = startEditingValue ? { filter, part: "value" } : null;

    if (operatorUnderEdition.type === newOperator.type) {
      this._nofityFiltersUpdate(ctxValue.filters, {
        action: "edit",
        prevFilter,
        filter,
        part: "operator",
      });

      this.set(ctxValue);

      return;
    }

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
      } else if (operatorUnderEdition.type === "multiple-value") {
        // IN -> =
        filter.value.id = filterUnderEdition.value.id[0];
        filter.value.value = filterUnderEdition.value.value[0];
        filter.value.label = filterUnderEdition.value.label.split(",")[0];
      }
    }

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
    const partialFilter = this.getPartialFilter(ctxValue);
    const { edition } = ctxValue;

    if (!edition) {
      partialFilter.value = newValue;
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
