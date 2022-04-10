import { StateMachineContext } from "./lib/state-machine";
import { AppFiltersTree } from "./AppFiltersTree";

export class AppStateMachineContext extends StateMachineContext {
  constructor({ initFilters, onUpdateFilters }) {
    const filtersTree = new AppFiltersTree({ initFilters, onUpdateFilters });

    const filters = filtersTree.getFilters();
    const insertion = filtersTree.getInsertion(); // { filter }
    const edition = filtersTree.getEdition(); // { filter, part }

    super({
      edition,
      insertion,
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

  reset(resetError, stopInserting = false) {
    const ctxValue = this.get();
    const lastLoadingError = ctxValue.suggestions.error;

    ctxValue.suggestions = {
      selectionType: "single",
      visible: resetError ? false : Boolean(lastLoadingError),
      loading: false,
      error: resetError ? null : lastLoadingError,
      items: [],
    };

    ctxValue.edition = this._filtersTree.stopEditing();

    if (stopInserting) {
      ctxValue.insertion = this._filtersTree.stopInserting();
    }

    this.set(ctxValue);
  }

  // filters accessors
  getLastFilter() {
    return this._filtersTree.getLastFilter();
  }

  getPartialFilter() {
    return this._filtersTree.getPartialFilter();
  }

  // loading
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

  // partial filters and filters creation
  createSearchTextFilter(valueItem) {
    const ctxValue = this.get();

    const { filters } = this._filtersTree.insertFilter({
      type: "search-text",
      attribute: null,
      operator: null,
      value: valueItem,
    });

    ctxValue.filters = filters;

    this.set(ctxValue);
  }

  createPartialFilter(attributeItem) {
    const ctxValue = this.get();

    const { filters } = this._filtersTree.insertFilter({
      type: "partial",
      attribute: attributeItem,
      operator: null,
      value: null,
    });

    ctxValue.filters = filters;

    this.set(ctxValue);
  }

  setPartialFilterOperator(operatorItem) {
    const ctxValue = this.get();

    ctxValue.filters = this._filtersTree.setPartialFilterOperator(operatorItem);

    this.set(ctxValue);
  }

  completePartialFilter(item, type = "attribute-operator-value") {
    const ctxValue = this.get();

    ctxValue.filters = this._filtersTree.completePartialFilter(item, type);

    this.set(ctxValue);
  }

  createLogicalOperatorFilter(logicalOperatorItem) {
    const ctxValue = this.get();

    const { filters } = this._filtersTree.insertFilter({
      type: "logical-operator",
      attribute: null,
      operator: logicalOperatorItem,
      value: null,
    });

    ctxValue.filters = filters;

    this.set(ctxValue);
  }

  // filters deletion
  removeFilter(filter) {
    const ctxValue = this.get();

    ctxValue.filters = this._filtersTree.removeFilter(filter);

    this.set(ctxValue);
  }

  removePartialFilter() {
    const ctxValue = this.get();

    ctxValue.filters = this._filtersTree.removePartialFilter();

    this.set(ctxValue);
  }

  removePartialFilterOperator() {
    const ctxValue = this.get();

    ctxValue.filters = this._filtersTree.setPartialFilterOperator(null);

    this.set(ctxValue);
  }

  // edition
  getEdition() {
    return this._filtersTree.getEdition();
  }

  isEditing() {
    return Boolean(this._filtersTree.getEdition());
  }

  isEditingPartialFilter() {
    return this._filtersTree.getEdition()?.filter?.type === "partial";
  }

  startEditing({ filter, part }) {
    const ctxValue = this.get();

    ctxValue.edition = this._filtersTree.startEditing(filter, part);

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

  editFilterAttribute(newAttributeItem) {
    const ctxValue = this.get();

    ctxValue.filters = this._filtersTree.editFilterAttribute(newAttributeItem);

    this.set(ctxValue);
  }

  editFilterOperator(newOperatorItem) {
    const ctxValue = this.get();

    ctxValue.filters = this._filtersTree.editFilterOperator(newOperatorItem);

    this.set(ctxValue);
  }

  editFilterValue(newValueItem) {
    const ctxValue = this.get();

    ctxValue.filters = this._filtersTree.editFilterValue(newValueItem);

    this.set(ctxValue);
  }

  // parentheses
  createParensFilter(movePartialFilter = false) {
    const ctxValue = this.get();
    let partialFilter = null;

    if (movePartialFilter) {
      partialFilter = this._filtersTree.getEdition().filter;

      this._filtersTree.removeFilter(partialFilter)

      ctxValue.edition = this._filtersTree.stopEditing();
    }

    const filtersInParens = partialFilter ? [partialFilter] : [];

    const { filters, newFilter } = this._filtersTree.insertFilter({
      type: "parens",
      filters: filtersInParens,
    });

    ctxValue.insertion = this._filtersTree.startInserting(newFilter);

    ctxValue.filters = filters;

    this.set(ctxValue);
  }

  startInserting(filter) {
    const ctxValue = this.get();

    ctxValue.insertion = this._filtersTree.startInserting(filter);

    this.set(ctxValue);
  }

  stopInserting() {
    const ctxValue = this.get();

    ctxValue.insertion = this._filtersTree.stopInserting();

    this.set(ctxValue);
  }

  groupFiltersInParens() {
    const ctxValue = this.get();

    const { filters } = this._filtersTree.groupFiltersInParens();

    ctxValue.filters = filters;

    this.set(ctxValue);
  }
}
