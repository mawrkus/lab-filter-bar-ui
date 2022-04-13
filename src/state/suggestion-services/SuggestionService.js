export class SuggestionService {
  constructor({
    attributeService,
    operatorService,
    valueService,
    logicalOperatorService,
  }) {
    this._attributeService = attributeService;
    this._operatorService = operatorService;
    this._valueService = valueService;
    this._logicalOperatorService = logicalOperatorService;
  }

  loadAttributes({ addParens }) {
    return this._attributeService.load({ addParens });
  }

  loadOperators() {
    return this._operatorService.load();
  }

  loadValues({ type }) {
    return this._valueService.load({ type });
  }

  loadLogicalOperators({ addParens }) {
    return this._logicalOperatorService.load({ addParens });
  }

  cancelLoad() {
    this._valueService.cancelLoad();
  }

  isCancelError(error) {
    return error instanceof DOMException && error.name === "AbortError";
  }
}
