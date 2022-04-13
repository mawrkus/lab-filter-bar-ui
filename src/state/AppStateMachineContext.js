import { copy } from "fastest-json-copy";
import { StateMachineContext } from "./lib/state-machine";
import { AppFiltersTree } from "./AppFiltersTree";

export class AppStateMachineContext extends StateMachineContext {
  constructor({ initFilters, onUpdateFilters }) {
    const filtersTree = new AppFiltersTree({ initFilters, onUpdateFilters });

    const filters = filtersTree.getFilters();
    const insertion = filtersTree.getInsertion(); // { filter }
    const edition = filtersTree.getEdition(); // { filter, part }

    super({
      insertion,
      edition,
      filters,
      suggestions: {
        selectionType: "single", // "single" or "multiple"
        visible: false,
        loading: false,
        error: null,
        items: [],
      },
    });

    this._filtersTree = filtersTree;
  }

  getLastFilter() {
    return this._filtersTree.getLastFilter();
  }

  getPartialFilter() {
    return this._filtersTree.getPartialFilter();
  }

  findPartialFilter() {
    return this._filtersTree.findPartialFilter();
  }

  /* suggestions loading */

  startLoading({ selectionType = "single" } = {}) {
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

  doneLoading({ items, selectionType = "single", error = null } = {}) {
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

  reset() {
    const ctxValue = this.get();

    ctxValue.suggestions = {
      selectionType: "single",
      visible: false,
      loading: false,
      error: null,
      items: [],
    };

    ctxValue.insertion = this._filtersTree.stopInserting();
    ctxValue.edition = this._filtersTree.stopEditing();

    this.set(ctxValue);
  }

  /* filter attributes */

  createPartialFilter({ item }) {
    const ctxValue = this.get();

    this._filtersTree.insertFilter({
      type: "partial",
      attribute: item,
      operator: null,
      value: null,
    });

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  createSearchTextFilter({ item }) {
    const ctxValue = this.get();

    this._filtersTree.insertFilter({
      type: "search-text",
      attribute: null,
      operator: null,
      value: item,
    });

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  createParensFilter({ filterToMove } = {}) {
    const ctxValue = this.get();

    const filters = filterToMove ? [filterToMove] : [];

    const newFilter = this._filtersTree.insertFilter({
      type: "parens",
      filters,
    });

    ctxValue.insertion = this._filtersTree.startInserting(newFilter);

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  convertEditionToParensFilter() {
    const ctxValue = this.get();

    const { filter } = this._filtersTree.getEdition();

    const childFilter = copy(filter);

    const newFilter = this._filtersTree.replaceFilter(filter, {
      type: "parens",
      filters: [childFilter],
    });

    ctxValue.insertion = this._filtersTree.startInserting(newFilter);

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  convertEditionToSearchTextFilter({ item }) {
    const ctxValue = this.get();

    const { filter } = this._filtersTree.getEdition();

    this._filtersTree.replaceFilter(filter, {
      type: "search-text",
      attribute: null,
      operator: null,
      value: item,
    });

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  editFilterAttribute({ item }) {
    const ctxValue = this.get();

    this._filtersTree.editFilterAttribute({ item });

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  /* filter operators */

  setPartialFilterOperator({ item }) {
    const ctxValue = this.get();

    this._filtersTree.setPartialFilterOperator({ item });

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  editFilterOperator({ item }) {
    const ctxValue = this.get();

    this._filtersTree.editFilterOperator({ item });

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  clearLoadingError() {
    const ctxValue = this.get();

    ctxValue.suggestions.error = null;

    this.set(ctxValue);
  }

  completePartialFilter({ item, type = "attribute-operator-value" }) {
    const ctxValue = this.get();

    this._filtersTree.completePartialFilter({ item, type });

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  createLogicalOperatorFilter({ item }) {
    const ctxValue = this.get();

    this._filtersTree.insertFilter({
      type: "logical-operator",
      attribute: null,
      operator: item,
      value: null,
    });

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  /* filters deletion */

  removeFilter(filter) {
    const ctxValue = this.get();

    this._filtersTree.removeFilter(filter);

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  removePartialFilterOperator() {
    const ctxValue = this.get();

    this._filtersTree.setPartialFilterOperator({ item: null });

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  /* edition */

  getEdition() {
    return this._filtersTree.getEdition();
  }

  isEditing(type) {
    return this._filtersTree.isEditing(type);
  }

  startEditing({ filter, part }) {
    const ctxValue = this.get();

    ctxValue.edition = this._filtersTree.startEditing({ filter, part });

    this.set(ctxValue);
  }

  stopEditing() {
    const ctxValue = this.get();

    ctxValue.edition = this._filtersTree.stopEditing();

    this.set(ctxValue);
  }

  setEditionPart(part) {
    const ctxValue = this.get();

    ctxValue.edition = this._filtersTree.setEditionPart(part);

    this.set(ctxValue);
  }

  editFilterValue({ item }) {
    const ctxValue = this.get();

    this._filtersTree.editFilterValue({ item });

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }

  /* insertion */

  isInserting() {
    return this._filtersTree.isInserting();
  }

  startInserting(filterId) {
    const ctxValue = this.get();

    const filterInTree = this._filtersTree.findFilterById(filterId);

    ctxValue.insertion = this._filtersTree.startInserting(filterInTree);

    this.set(ctxValue);
  }

  // stopInserting() {
  //   const ctxValue = this.get();

  //   ctxValue.insertion = this._filtersTree.stopInserting();

  //   this.set(ctxValue);
  // }

  getInsertion() {
    return this._filtersTree.getInsertion();
  }

  groupFiltersInParens() {
    const ctxValue = this.get();

    this._filtersTree.groupFiltersInParens();

    ctxValue.filters = this._filtersTree.getFilters();

    this.set(ctxValue);
  }
}
