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

    this._request = null;
  }

  loadAttributes() {
    return this._attributeService.load();
  }

  loadOperators() {
    return this._operatorService.load();
  }

  async loadValues({ type }) {
    return this._valueService.load({ type });
  }

  loadLogicalOperators() {
    return this._logicalOperatorService.load();
  }
}
