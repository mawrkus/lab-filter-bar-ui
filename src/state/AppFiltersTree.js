import { copy } from "fastest-json-copy";

export class AppFiltersTree {
  constructor({ initFilters, onUpdateFilters }) {
    this._nofityFiltersUpdate = onUpdateFilters;

    this._rootFilter = {
      id: "root",
      filters: initFilters,
    };

    this._lastFilterIndex = initFilters.length + 1;

    this._edition = null;
    this._insertion = { filter: this._rootFilter };
  }

  _genFilterId() {
    return `f${this._lastFilterIndex++}`;
  }

  getFilters() {
    return this._rootFilter.filters;
  }

  getLastFilter() {
    const filters = this.getFilters();

    return filters[filters.length - 1] || null;
  }

  findFilterById(filterId) {
    return this.getFilters().find(({ id }) => id === filterId);
  }

  // partial filters
  getPartialFilter() {
    const lastFilter = this.getLastFilter();

    return lastFilter?.type === "partial" ? lastFilter : null;
  }

  setPartialFilterAttribute(attributeItem) {
    this.getPartialFilter().attribute = attributeItem;

    return this._rootFilter.filters;
  }

  setPartialFilterOperator(operatorItem) {
    this.getPartialFilter().operator = operatorItem;

    return this._rootFilter.filters;
  }

  completePartialFilter(item, type) {
    const partialFilter = this.getPartialFilter();

    partialFilter.type = type;

    switch (type) {
      case "attribute-operator":
        partialFilter.operator = item;

        partialFilter.value = {
          id: null,
          value: item.presetValue,
          label: String(item.presetValue),
        };
        break;

      case "attribute-operator-value":
        partialFilter.value = item;
        break;

      default:
        throw new TypeError(`Unknown filter type "${type}"!`);
    }

    this._nofityFiltersUpdate(this._rootFilter.filters, {
      action: "create",
      filter: partialFilter,
    });

    return this._rootFilter.filters;
  }

  // insertion
  getInsertion() {
    return this._insertion;
  }

  startInserting(filter) {
    this._insertion = { filter };

    return this._insertion;
  }

  stopInserting() {
    this._insertion = { filter: this._rootFilter };

    return this._insertion;
  }

  insertFilter(newFilter) {
    const { filters } = this._insertion.filter;

    newFilter.id = this._genFilterId();

    filters.push(newFilter);

    if (newFilter.type !== "partial") {
      this._nofityFiltersUpdate(filters, {
        action: "create",
        filter: newFilter,
      });
    }

    return {
      filters: this._rootFilter.filters,
      newFilter,
    };
  }

  // deletion
  removeFilter(filter) {
    const filters = this.getFilters();

    if (!filters.length) {
      return filters;
    }

    const index = filters.findIndex((f) => f.id === filter.id);

    filters.splice(index, 2);

    this._nofityFiltersUpdate(filters, {
      action: "remove",
      filter,
    });

    return filters;
  }

  removePartialFilter() {
    const filters = this.getFilters();

    filters.pop();

    return filters;
  }

  removePartialOperator() {
    this.getPartialFilter().operator = null;

    return this.getFilters();
  }

  // edition
  getEdition() {
    return this._edition;
  }

  isEditingPartialFilter() {
    return this.getEdition()?.filter?.type === "partial";
  }

  startEditing(filter, part) {
    this._edition = {
      filter: this.findFilterById(filter.id),
      part,
    };

    return this._edition;
  }

  stopEditing() {
    this._edition = null;

    return this._edition;
  }

  setEditionPart(newPart) {
    this._edition.part = newPart;

    return this._edition;
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
  editFilterOperator(newOperatorItem) {
    const filters = this.getFilters();
    const { filter } = this.getEdition();
    const prevFilter = copy(filter);

    filter.operator = newOperatorItem;

    if (prevFilter.operator.type === newOperatorItem.type) {
      this._nofityFiltersUpdate(filters, {
        action: "edit",
        prevFilter,
        filter,
        part: "operator",
      });

      return filters;
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
      if (prevFilter.operator.type === "single-value") {
        // = -> IN
        if (prevFilter.value.id === null) {
          // search text
          filter.value = null; // no search text support in multiple suggestions dropdown component :/
        } else {
          filter.value.id = [prevFilter.value.id];
          filter.value.value = [prevFilter.value.value];
        }
      } else if (prevFilter.operator.type === "preset-value") {
        // IS NULL -> IN
        filter.value = null; // no search text support in multiple suggestions dropdown component :/
        filter.type = "attribute-operator-value";
      }
    } else if (newOperatorItem.type === "single-value") {
      // IS NULL -> =, IN -> =
      if (prevFilter.operator.type === "preset-value") {
        filter.value = {
          id: null,
          value: prevFilter.operator.presetValue,
          label: String(prevFilter.operator.presetValue),
        };

        filter.type = "attribute-operator-value";
      } else if (prevFilter.operator.type === "multiple-value") {
        // IN -> =
        filter.value.id = prevFilter.value.id[0];
        filter.value.value = prevFilter.value.value[0];
        filter.value.label = prevFilter.value.label.split(",")[0];
      }
    }

    this._nofityFiltersUpdate(filters, {
      action: "edit",
      prevFilter,
      filter,
      part: "operator",
    });

    return filters;
  }

  editFilterValue(newValueItem) {
    const { filter } = this.getEdition();
    const prevFilter = copy(filter);

    filter.value = newValueItem;

    this._nofityFiltersUpdate(this.getFilters(), {
      action: "edit",
      prevFilter,
      filter,
      part: "value",
    });

    return this._rootFilter.filters;
  }
}
