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

  loadAttributes() {
    return this._attributeService.load();
  }

  loadOperators() {
    return this._operatorService.load();
  }

  loadValues({ type }) {
    return this._valueService.load({ type });
  }

  loadLogicalOperators({ parens }) {
    return this._logicalOperatorService.load({ parens });
  }

  cancelLoad() {
    this._valueService.cancelLoad();
  }

  isCancelError(error) {
    return error instanceof DOMException && error.name === 'AbortError';
  }
}
