import { SuggestionService } from "./SuggestionService";
import { AttributeService } from "./AttributeService";
import { OperatorService } from "./OperatorService";
import { ValueService } from "./ValueService";
import { LogicalOperatorService } from "./LogicalOperatorService";
import { HttpClient } from "./HttpClient";

export const suggestionService = new SuggestionService({
  attributeService: new AttributeService(),
  operatorService: new OperatorService(),
  valueService: new ValueService({ httpClient: new HttpClient() }),
  logicalOperatorService: new LogicalOperatorService(),
});
