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

    ctxValue.edition = this.stopEditing();
    ctxValue.insertion = this._filtersTree.resetInsertion();

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

    ctxValue.filters = this._filtersTree.insertFilter({
      type: "search-text",
      attribute: null,
      operator: null,
      value: valueItem,
    });

    this.set(ctxValue);
  }

  createPartialFilter(attributeItem) {
    const ctxValue = this.get();

    ctxValue.filters = this._filtersTree.insertFilter({
      type: "partial",
      attribute: attributeItem,
      operator: null,
      value: null,
    });

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

    ctxValue.filters = this._filtersTree.insertFilter({
      type: "logical-operator",
      attribute: null,
      operator: logicalOperatorItem,
      value: null,
    });

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

  removePartialOperator() {
    const ctxValue = this.get();

    ctxValue.filters = this._filtersTree.removePartialOperator();

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
    return this._filtersTree.isEditingPartialFilter();
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

  editPartialFilterAttribute(newAttributeItem) {
    const ctxValue = this.get();

    ctxValue.filters =
      this._filtersTree.setPartialFilterAttribute(newAttributeItem);

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

  // // parentheses
  // createParensFilter() {
  //   const ctxValue = this.get();
  //   const { filters } = ctxValue.filtersTree;

  //   const newFilter = {
  //     id: this.getFilterId(),
  //     type: "parens",
  //     filters: [],
  //   };

  //   filters.push(newFilter);

  //   this._nofityFiltersUpdate(filters, {
  //     action: "create",
  //     filter: newFilter,
  //   });

  //   this.set(ctxValue);

  //   return newFilter;
  // }

  // groupFiltersInParens() {
  //   const ctxValue = this.get();
  //   const { edition, filters } = ctxValue;
  //   const filterUnderEdition = edition.filter;
  //   const filterIndex = filters.findIndex(
  //     (f) => f.id === filterUnderEdition.id
  //   );

  //   const newParensGroup = {
  //     id: this.getFilterId(),
  //     type: "parens",
  //     filters: [
  //       { ...filters[filterIndex - 1], parentId: filterUnderEdition.id },
  //       { ...filters[filterIndex], parentId: filterUnderEdition.id },
  //       { ...filters[filterIndex + 1], parentId: filterUnderEdition.id },
  //     ],
  //   };

  //   filters.splice(filterIndex - 1, 3, newParensGroup);

  //   this._nofityFiltersUpdate(filters, {
  //     action: "create",
  //     filter: newParensGroup,
  //   });

  //   this.set(ctxValue);
  // }

  // // filters insertion
  // startInserting(filter) {
  //   const ctxValue = this.get();

  //   ctxValue.insertion = { filter };

  //   this.set(ctxValue);
  // }

  // stopInserting() {
  //   const ctxValue = this.get();

  //   ctxValue.insertion = { filter: this._filtersTreeRoot };

  //   this.set(ctxValue);
  // }
}
