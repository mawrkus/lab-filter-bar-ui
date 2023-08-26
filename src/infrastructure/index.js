import { AttributeService } from "./AttributeService";
import { LogicalOperatorService } from "./LogicalOperatorService";
import { OperatorService } from "./OperatorService";
import { SuggestionService } from "./SuggestionService";
import { ValueService } from "./ValueService";

import { TvMazeApiClient } from "./http/TvMazeApiClient";

export const buildSuggestionService = () =>
  new SuggestionService({
    attributeService: new AttributeService(),
    operatorService: new OperatorService(),
    valueService: new ValueService({ apiClient: new TvMazeApiClient() }),
    logicalOperatorService: new LogicalOperatorService(),
  });
