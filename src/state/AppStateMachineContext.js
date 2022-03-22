import { copy } from "fastest-json-copy";
import { StateMachineContext } from "./lib/state-machine";

export class AppStateMachineContext extends StateMachineContext {
  constructor({ initFilters, onUpdateFilters }) {
    super({
      edition: null,
      filters: initFilters,
      suggestions: {
        selectionType: "single", // "single" or "multiple"
        visible: false,
        loading: false,
        error: null,
        items: [],
      },
    });

    this._lastFilterIndex = initFilters.length + 1;
    this._nofityFiltersUpdate = onUpdateFilters;
  }

  getFilterId() {
    return `f${this._lastFilterIndex++}`;
  }

  reset(resetError) {
    const ctxValue = this.get();
    const lastLoadingError = ctxValue.suggestions.error;

    ctxValue.suggestions = {
      selectionType: "single",
      visible: resetError ? false : Boolean(lastLoadingError),
      loading: false,
      error: resetError ? null : lastLoadingError,
      items: [],
    };

    ctxValue.edition = null;

    this.set(ctxValue);
  }

  // loading states
  startLoading(selectionType = "single") {
    const ctxValue = this.get();

    ctxValue.suggestions = {
      selectionType,
      visible: true,
      loading: true,
      error: null,
      items: [],
    };

    this.set(ctxValue);
  }

  doneLoading(items, selectionType = "single", error = null) {
    const ctxValue = this.get();

    ctxValue.suggestions = {
      selectionType,
      visible: true,
      loading: false,
      error,
      items,
    };

    this.set(ctxValue);
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

  setPartialFilterAttribute(attributeItem) {
    const ctxValue = this.get();
    const { edition, filters } = ctxValue;

    if (edition) {
      const filterUnderEdition = ctxValue.filters.find(
        (f) => f.id === edition.filter.id
      );

      filterUnderEdition.attribute = attributeItem;

      this.set(ctxValue);
      return;
    }

    const newPartialFilter = {
      id: this.getFilterId(),
      type: "partial",
      attribute: attributeItem,
      operator: null,
      value: null,
    };

    filters.push(newPartialFilter);

    this.set(ctxValue);
  }

  setPartialFilterOperator(operatorItem) {
    const ctxValue = this.get();

    this.getPartialFilter(ctxValue).operator = operatorItem;

    this.set(ctxValue);
  }

  completePartialFilter(valueItem, type = "attribute-operator-value") {
    const ctxValue = this.get();
    const partialFilter = this.getPartialFilter(ctxValue);
    const { filters } = ctxValue;

    partialFilter.value = valueItem;
    partialFilter.type = type;

    this._nofityFiltersUpdate(filters, {
      action: "create",
      filter: partialFilter,
    });

    this.set(ctxValue);
  }

  completePartialAttributeOperatorFilter(operatorItem) {
    this.setPartialFilterOperator(operatorItem);

    const filterValue = {
      id: null,
      value: operatorItem.presetValue,
      label: String(operatorItem.presetValue),
    };

    this.completePartialFilter(filterValue, "attribute-operator");
  }

  createSearchTextFilter(valueItem) {
    const ctxValue = this.get();
    const { filters } = ctxValue;

    const newFilter = {
      id: this.getFilterId(),
      type: "search-text",
      attribute: null,
      operator: null,
      value: valueItem,
    };

    filters.push(newFilter);

    this._nofityFiltersUpdate(filters, { action: "create", filter: newFilter });
    this.set(ctxValue);
  }

  createLogicalOperatorFilter(logicalOperatorItem) {
    const ctxValue = this.get();
    const { filters } = ctxValue;

    const newFilter = {
      id: this.getFilterId(),
      type: "logical-operator",
      attribute: null,
      operator: logicalOperatorItem,
      value: null,
    };

    filters.push(newFilter);

    ctxValue.edition = null;

    this._nofityFiltersUpdate(filters, { action: "create", filter: newFilter });
    this.set(ctxValue);
  }

  // filters edition
  startEditing({ filter, part }) {
    const ctxValue = this.get();

    ctxValue.edition = {
      filter,
      part,
    };

    this.set(ctxValue);
  }

  stopEditing() {
    const ctxValue = this.get();

    ctxValue.edition = null;

    this.set(ctxValue);
  }

  isEditing() {
    return this.getEdition() !== null;
  }

  isEditingPartialFilter() {
    return this.getEdition()?.filter?.type === "partial";
  }

  getEdition() {
    return this.get().edition;
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
  editFilterOperator(newOperatorItem, startEditingValue = false) {
    const ctxValue = this.get();
    const filterUnderEdition = ctxValue.edition.filter;
    const operatorUnderEdition = filterUnderEdition.operator;
    const filter = ctxValue.filters.find((f) => f.id === filterUnderEdition.id);
    const prevFilter = copy(filter);

    filter.operator = newOperatorItem;

    if (operatorUnderEdition.type === newOperatorItem.type) {
      this._nofityFiltersUpdate(ctxValue.filters, {
        action: "edit",
        prevFilter,
        filter,
        part: "operator",
      });

      this.set(ctxValue);

      return filter;
    }

    // = -> IS NULL
    if (newOperatorItem.type === "preset-value") {
      filter.value = {
        id: null,
        value: newOperatorItem.presetValue,
        label: String(newOperatorItem.presetValue),
      };

      filter.type = "attribute-operator";
    } else if (newOperatorItem.type === "multiple-value") {
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
    } else if (newOperatorItem.type === "single-value") {
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

    return filter;
  }

  editFilterValue(newValueItem) {
    const ctxValue = this.get();
    const partialFilter = this.getPartialFilter(ctxValue);
    const { edition } = ctxValue;

    if (!edition) {
      partialFilter.value = newValueItem;
      this.set(ctxValue);
      return;
    }

    const filter = ctxValue.filters.find((f) => f.id === edition.filter.id);
    const prevFilter = copy(filter);

    filter.value = newValueItem;

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
