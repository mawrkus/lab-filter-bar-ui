import { attributeService } from "./attributeService";
import { operatorService } from "./operatorService";
import { valueService } from "./valueService";
import { logicalOperatorService } from "./logicalOperatorService";

export const suggestionService = {
  loadAttributes: attributeService.load,
  loadOperators: operatorService.load,
  loadValues: valueService.load,
  loadLogicalOperators: logicalOperatorService.load,
};
