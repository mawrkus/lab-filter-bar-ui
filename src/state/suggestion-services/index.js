import { SuggestionService } from "./SuggestionService";
import { AttributeService } from "./AttributeService";
import { OperatorService } from "./OperatorService";
import { ValueService } from "./ValueService";
import { LogicalOperatorService } from "./LogicalOperatorService";

export const suggestionService = new SuggestionService({
  attributeService: new AttributeService(),
  operatorService: new OperatorService(),
  valueService: new ValueService({ httpClient: window.fetch.bind(window) }),
  logicalOperatorService: new LogicalOperatorService(),
});
