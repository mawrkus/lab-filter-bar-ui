import { memo } from "react";
import areEqual from "fast-deep-equal";

import { ChicletAttributeOperatorValue } from "./ChicletAttributeOperatorValue";
import { ChicletAttributeOperator } from "./ChicletAttributeOperator";
import { ChicletLogicalOperator } from "./ChicletLogicalOperator";
import { ChicletSearchText } from "./ChicletSearchText";

const ChicletComponent = ({ filter, onClick, onRemove }) => {
  switch (filter.type) {
    case "attribute-operator-value":
      return (
        <ChicletAttributeOperatorValue
          filter={filter}
          onClick={onClick}
          onRemove={onRemove}
        />
      );

    case "attribute-operator":
      return (
        <ChicletAttributeOperator
          filter={filter}
          onClick={onClick}
          onRemove={onRemove}
        />
      );

    case "logical-operator":
      return (
        <ChicletLogicalOperator
          filter={filter}
          onClick={onClick}
        />
      );

    case "search-text":
      return (
        <ChicletSearchText
          filter={filter}
          onClick={onClick}
          onRemove={onRemove}
        />
      );

    default:
      throw new TypeError(
        `Unsupported filter type "${filter.type}" (${JSON.stringify(filter)})!`
      );
  }
};

export const Chiclet = memo(ChicletComponent, areEqual);
