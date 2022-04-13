import { AttributeService } from "./AttributeService";
import { LogicalOperatorService } from "./LogicalOperatorService";
import { OperatorService } from "./OperatorService";
import { SuggestionService } from "./SuggestionService";
import { ValueService } from "./ValueService";

import { HttpClient } from "./HttpClient";

export const buildSuggestionService = () => new SuggestionService({
  attributeService: new AttributeService(),
  operatorService: new OperatorService(),
  valueService: new ValueService({ httpClient: new HttpClient() }),
  logicalOperatorService: new LogicalOperatorService(),
});
