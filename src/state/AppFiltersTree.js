import { copy } from "fastest-json-copy";

export class AppFiltersTree {
  constructor({ initFilters, onUpdateFilters }) {
    this._nofityFiltersUpdate = (newFilters, event) => {
      if (event.filter.type !== "partial") {
        onUpdateFilters(newFilters, event);
      }
    };

    this._lastFilterIndex = initFilters.length + 1;

    this._rootFilter = {
      id: "root",
      filters: initFilters,
    };

    this._insertion = { filter: this._rootFilter };

    this._edition = null;
  }

  _genFilterId() {
    return `f${this._lastFilterIndex++}`;
  }

  _findFilterBy(searchFn, filters = this._rootFilter.filters) {
    for (let i = 0; i < filters.length; i += 1) {
      let filter = filters[i];

      if (searchFn(filter)) {
        return filter;
      }

      if (filter.type === "parens") {
        const childFilter = this._findFilterBy(searchFn, filter.filters);

        if (childFilter) {
          return childFilter;
        }
      }
    }

    return null;
  }

  _removeFilter(filter, filters = this._rootFilter.filters) {
    const newFilters = [];

    for (let i = 0; i < filters.length; i++) {
      const currentFilter = filters[i];

      if (currentFilter.id === filter.id) {
        i += 1; // remove logical operator at right
        continue;
      }

      newFilters.push(currentFilter);

      if (currentFilter.type === "parens") {
        currentFilter.filters = this._removeFilter(
          filter,
          currentFilter.filters
        );
      }
    }

    return newFilters;
  }

  /* filter accessors */

  getFilters() {
    return this._rootFilter.filters;
  }

  // returns the last filter at the current insertion point
  getLastFilter() {
    const { filters } = this._insertion.filter;

    return filters[filters.length - 1] || null;
  }

  // get the last filter at current insertion point and checks if it's partial
  getPartialFilter() {
    const lastFilter = this.getLastFilter();

    return lastFilter?.type === "partial" ? lastFilter : null;
  }

  // traverses the whole tree to find the 1st partial filter
  findPartialFilter() {
    return this._findFilterBy((f) => f.type === "partial");
  }

  /* inserting mode */

  startInserting(filterId) {
    this._insertion = { filter: this._findFilterBy((f) => f.id === filterId) };

    return this._insertion;
  }

  isInserting() {
    return this._insertion.filter.id !== "root";
  }

  getInsertion() {
    return this._insertion;
  }

  stopInserting() {
    this._insertion = { filter: this._rootFilter };

    return this._insertion;
  }

  /* editing mode */

  startEditing(filter, part) {
    this._edition = {
      part,
      filter: this._findFilterBy((f) => f.id === filter.id),
    };

    return this._edition;
  }

  setEditionPart(part) {
    this._edition.part = part;

    return this._edition;
  }

  isEditing(type) {
    if (type) {
      return this._edition?.filter?.type === type;
    }

    return this._edition !== null;
  }

  getEdition() {
    return this._edition;
  }

  stopEditing() {
    this._edition = null;

    return this._edition;
  }

  /* filters creation */

  insertFilter(filter) {
    const { filters, id: parentId } = this._insertion.filter;

    filter.id = this._genFilterId();

    if (this.isInserting()) {
      filter.parentId = parentId;
    }

    filters.push(filter);

    this._nofityFiltersUpdate(filters, {
      action: "create",
      filter,
    });

    return filter;
  }

  setPartialFilterOperator(item) {
    const partialFilter = this.getPartialFilter();

    partialFilter.operator = item;

    return partialFilter;
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

    return partialFilter;
  }

  /* filters edition */

  editFilterAttribute(item) {
    const { filter } = this._edition;
    const prevFilter = copy(filter);

    filter.attribute = item;

    this._nofityFiltersUpdate(this._rootFilter.filters, {
      action: "edit",
      prevFilter,
      filter,
      part: "attribute",
    });

    return filter;
  }

  // /*
  //   single-value operators:
  //     = -> != (only change operator) => proxyToNextSuggestions
  //     = -> IS NULL (change operator and value) => proxyToNextSuggestions
  //     = -> IN (change operator and value becomes an array) => displayValueSuggestions

  //   preset-value operators:
  //     IS NULL -> IS NOT NULL (only change operator) => proxyToNextSuggestions
  //     IS NULL -> = (change operator and value) => displayValueSuggestions
  //     IS NULL -> IN (change operator and value and value becomes an array) => displayValueSuggestions

  //   multiple-value operators
  //     IN -> NOT IN (only change operator) => proxyToNextSuggestions
  //     IN -> = (change operator and value becomes a primitive) => displayValueSuggestions
  //     IN -> IS NULL (change operator and value and value becomes a primitive) => proxyToNextSuggestions
  // */
  editFilterOperator(item) {
    const { filters } = this._rootFilter;
    const { filter } = this._edition;
    const prevFilter = copy(filter);

    filter.operator = item;

    if (prevFilter.operator.type === item.type) {
      this._nofityFiltersUpdate(filters, {
        action: "edit",
        prevFilter,
        filter,
        part: "operator",
      });

      return filter;
    }

    // = -> IS NULL
    if (item.type === "preset-value") {
      filter.value = {
        id: null,
        value: item.presetValue,
        label: String(item.presetValue),
      };

      filter.type = "attribute-operator";
    } else if (item.type === "multiple-value") {
      // = -> IN, IS NULL -> IN
      if (prevFilter.operator.type === "single-value") {
        // = -> IN
        // (also support partial filter edition with no value yet)
        if (prevFilter.value === null || prevFilter.value.id === null) {
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
    } else if (item.type === "single-value") {
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
        if (prevFilter.value === null) {
          filter.value = null;
        } else {
          filter.value.id = prevFilter.value.id[0];
          filter.value.value = prevFilter.value.value[0];
          filter.value.label = prevFilter.value.label.split(",")[0];
        }
      }
    }

    this._nofityFiltersUpdate(filters, {
      action: "edit",
      prevFilter,
      filter,
      part: "operator",
    });

    return filter;
  }

  editFilterValue(item) {
    const { filter } = this._edition;
    const prevFilter = copy(filter);

    filter.value = item;

    this._nofityFiltersUpdate(this._rootFilter.filters, {
      action: "edit",
      prevFilter,
      filter,
      part: "value",
    });

    return this._rootFilter.filters;
  }

  replaceFilter(fromFilter, toFilter) {
    const { filters } = this._insertion.filter;

    Object.keys(fromFilter).forEach((key) => {
      delete fromFilter[key];
    });

    Object.entries(toFilter).forEach(([key, value]) => {
      fromFilter[key] = value;
    });

    fromFilter.id = this._genFilterId();

    if (fromFilter.type === "parens") {
      fromFilter.filters.forEach((childFilter) => {
        childFilter.parentId = fromFilter.id;
      });
    }

    this._nofityFiltersUpdate(filters, {
      action: "create",
      filter: fromFilter,
    });

    return fromFilter;
  }

  groupFiltersInParens() {
    const { filter } = this._edition;
    const { filters } = this._rootFilter;

    // works because we can only group filters that are not in parens (parens have max depth=1)
    const filterIndex = this._rootFilter.filters.findIndex(
      (f) => f.id === filter.id
    );

    const newFilter = {
      id: this._genFilterId(),
      type: "parens",
      filters: [
        filters[filterIndex - 1],
        filters[filterIndex],
        filters[filterIndex + 1],
      ],
    };

    filters.splice(filterIndex - 1, 3, newFilter);

    this._nofityFiltersUpdate(filters, {
      action: "create",
      filter: newFilter,
    });

    return {
      filters,
      newFilter,
    };
  }

  /* filters deletion */

  removeFilter(filter) {
    this._rootFilter.filters = this._removeFilter(filter);

    this._nofityFiltersUpdate(this._rootFilter.filters, {
      action: "remove",
      filter,
    });

    return filter;
  }
}
