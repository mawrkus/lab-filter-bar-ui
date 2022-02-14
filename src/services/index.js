import { attributeService } from "./attributeService";
import { operatorService } from "./operatorService";
import { valueService } from "./valueService";

export const service = {
  loadAttributes: attributeService.load,
  loadOperators: operatorService.load,
  loadValues: valueService.load,
};
